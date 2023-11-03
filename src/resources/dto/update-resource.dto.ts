import { PartialType } from '@nestjs/mapped-types';
import { CreateResourceDto } from './create-resource.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsInEnum } from 'src/common/validators/is-in-enum.validator';
import { ResourceType } from '../types/resource-types';

export class UpdateResourceDto extends PartialType(CreateResourceDto) {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsInEnum(ResourceType)
  type: ResourceType;

  @IsOptional()
  description: string;
}
