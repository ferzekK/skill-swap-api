import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';

import { UserSkill } from './user-skill.model';
import { User } from './user.model';

@Table({ tableName: 'skills', timestamps: true })
export class Skill extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string;

  @BelongsToMany(() => User, () => UserSkill)
  declare users: User[];
}
