import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Actions } from '../constants/actions';
import { Resource } from 'src/resources/entities/resource.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  action: Actions;

  @ManyToOne(() => Resource, (resource) => resource.permissions)
  resource: Resource;
}
