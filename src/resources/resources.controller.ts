import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  NotFoundException,
  Put,
  Delete,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptors';
import { ResourceDto } from './dto/resource.dto';

@Controller('resources')
@UseGuards(AuthGuard)
@Serialize(ResourceDto)
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  create(@Body() createResourceDto: CreateResourceDto) {
    return this.resourcesService.create(createResourceDto);
  }

  @Get()
  findAll() {
    return this.resourcesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const resource = await this.resourcesService.findOne(parseInt(id));
    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    return resource;
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
  ) {
    return this.resourcesService.update(+id, updateResourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resourcesService.remove(+id);
  }
}
