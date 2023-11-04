import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ResourceType } from '../types/resource-types';
import { Permission } from 'src/permissions/entities/permission.entity';

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  // @Column({
  //   type: 'enum',
  //   enum: ResourceType,
  //   default: ResourceType.DATABASE_RECORD,
  // })
  // TODO: Change the type to enum by uncommenting the above line
  @Column()
  type: ResourceType;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Permission, (permission) => permission.resource)
  permissions: Permission[];
}
