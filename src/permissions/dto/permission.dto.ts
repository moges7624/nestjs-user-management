import { Expose, Transform } from 'class-transformer';
import { Actions } from '../constants/actions';
import { Resource } from 'src/resources/entities/resource.entity';

export class PermissionDto {
  @Expose()
  id: number;

  @Expose()
  name: number;

  @Expose()
  action: Actions;

  @Transform(({ obj }) => obj.resource)
  @Expose()
  resource: Resource;
}
