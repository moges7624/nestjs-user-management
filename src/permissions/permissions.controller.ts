import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Serialize } from 'src/common/interceptors/serialize.interceptors';
import { PermissionDto } from './dto/permission.dto';

@Controller('permissions')
@UseGuards(AuthGuard)
@Serialize(PermissionDto)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const permission = await this.permissionsService.findOneById(+id);
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return permission;
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(+id);
  }
}
