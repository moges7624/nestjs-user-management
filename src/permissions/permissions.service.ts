import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ResourcesService } from 'src/resources/resources.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission) private repository: Repository<Permission>,
    private resourceService: ResourcesService,
  ) {}
  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const resource = await this.resourceService.findOne(
      createPermissionDto.resourceId,
    );

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    const permission = this.repository.create({
      name: createPermissionDto.name,
      action: createPermissionDto.action,
    });

    permission.resource = resource;

    return await this.repository.save(permission);
  }

  findAll(): Promise<Permission[]> {
    return this.repository.find({
      relations: {
        resource: true,
      },
    });
  }

  findOneById(id: number): Promise<Permission> {
    return this.repository.findOneBy({ id });
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.findOneById(id);
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    if (updatePermissionDto.resourceId) {
      const resource = await this.resourceService.findOne(
        updatePermissionDto.resourceId,
      );

      if (!resource) {
        throw new NotFoundException('Resource not found');
      }

      permission.resource = resource;
    }

    Object.assign(permission, updatePermissionDto);
    return this.repository.save(permission);
  }

  async remove(id: number): Promise<Permission> {
    const permission = await this.findOneById(id);

    if (!permission) {
      throw new NotFoundException('Resource not found');
    }

    return this.repository.remove(permission);
  }
}
