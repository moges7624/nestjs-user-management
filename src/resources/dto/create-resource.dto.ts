import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsInEnum } from 'src/common/validators/is-in-enum.validator';
import { ResourceType } from '../types/resource-types';

export class CreateResourceDto {
  @IsNotEmpty()
  name: string;

  @IsInEnum(ResourceType)
  type: ResourceType;

  @IsOptional()
  description: string;
}
