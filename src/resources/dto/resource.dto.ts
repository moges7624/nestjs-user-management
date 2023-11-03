import { Expose } from 'class-transformer';

export class ResourceDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  type: string;

  @Expose()
  description: string;
}
