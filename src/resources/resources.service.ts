import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from './entities/resource.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource) private repository: Repository<Resource>,
  ) {}
  async create(createResourceDto: CreateResourceDto): Promise<Resource> {
    const resourceWithSameName = await this.repository.findOneBy({
      name: createResourceDto.name,
    });

    if (resourceWithSameName) {
      throw new HttpException(
        `Resource with name ${createResourceDto.name} already exists`,
        HttpStatus.CONFLICT,
      );
    }
    const resource = this.repository.create(createResourceDto);
    return await this.repository.save(resource);
  }

  findAll(conditions?: Partial<Resource>): Promise<Resource[]> {
    return this.repository.find({ where: conditions });
  }

  findOne(id: number): Promise<Resource> {
    return this.repository.findOneBy({ id });
  }

  async update(
    id: number,
    updateResourceDto: UpdateResourceDto,
  ): Promise<Resource> {
    const resource = await this.findOne(id);

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    Object.assign(resource, updateResourceDto);
    return this.repository.save(resource);
  }

  async remove(id: number): Promise<Resource> {
    const resource = await this.findOne(id);

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    return this.repository.remove(resource);
  }
}
