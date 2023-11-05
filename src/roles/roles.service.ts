import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { PermissionsService } from 'src/permissions/permissions.service';
import { Permission } from 'src/permissions/entities/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private repository: Repository<Role>,
    private permissionService: PermissionsService,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    // TODO: Add to role_permissions only if they are unique
    const permissons: Permission[] = await this.permissionService.findAllByIds(
      createRoleDto.permissions,
    );

    const role = this.repository.create({
      name: createRoleDto.name,
      description: createRoleDto.description,
    });

    role.permissions = permissons;

    return this.repository.save(role);
  }

  findAll(): Promise<Role[]> {
    return this.repository.find({
      relations: {
        permissions: true,
      },
    });
  }

  findOneById(id: number): Promise<Role> {
    return this.repository.findOne({
      where: { id },
      relations: {
        permissions: true,
      },
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOneById(id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (updateRoleDto.permissions) {
      const permissions = await this.permissionService.findAllByIds(
        updateRoleDto.permissions,
      );

      role.permissions = permissions;
      delete updateRoleDto.permissions;
    }

    Object.assign(role, updateRoleDto);

    return await this.repository.save(role);
  }

  async remove(id: number) {
    const role = await this.findOneById(id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return this.repository.remove(role);
  }
}
