import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { Skill } from './skill.model';
import { User } from './user.model';

export type UserSkillType = 'OFFER' | 'LEARN';

@Table({ tableName: 'user_skills', timestamps: true })
export class UserSkill extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare userId: string;

  @ForeignKey(() => Skill)
  @Column({ type: DataType.UUID, allowNull: false })
  declare skillId: string;

  @Column({ type: DataType.ENUM('OFFER', 'LEARN'), allowNull: false })
  declare type: UserSkillType;

  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Skill)
  declare skill: Skill;
}
