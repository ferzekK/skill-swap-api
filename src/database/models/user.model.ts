import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';

import { Skill } from './skill.model';
import { UserSkill } from './user-skill.model';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare passwordHash: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare fullName: string;

  @BelongsToMany(() => Skill, () => UserSkill)
  declare skills: Skill[];
}
