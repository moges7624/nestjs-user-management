import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ResourceType } from '../types/resource-types';

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
  @Column()
  type: ResourceType;

  @Column({ nullable: true })
  description?: string;
}
