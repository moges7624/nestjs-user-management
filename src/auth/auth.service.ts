import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SigninDto } from './dto/sigin.dto';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(signupData: SignupDto) {
    const user = await this.userService.create(signupData);
    return user;
  }

  async signin(signinData: SigninDto) {
    const [user] = await this.userService.findAll({
      email: signinData.email,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(signinData.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }
}
