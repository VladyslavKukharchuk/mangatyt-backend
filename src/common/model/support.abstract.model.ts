import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export default abstract class SupportModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'resource_id',
  })
  @Index({ unique: true })
  resourceId: string;

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt: Date;
}
