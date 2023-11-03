import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/sigin.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptors';
import { UserDto } from 'src/users/dto/user.dto';
import { SignupDto } from './dto/signup.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signup')
  async signup(@Body() signupData: SignupDto, @Session() session: any) {
    const user = await this.authService.signup(signupData);
    session.userId = user.id;

    return user;
  }

  @Post('/signin')
  async signin(@Body() signinData: SigninDto, @Session() session: any) {
    const user = await this.authService.signin(signinData);
    session.userId = user.id;

    return user;
  }

  @Post('/signout')
  async signout(@Session() session: any) {
    session.userId = null;
  }
}
