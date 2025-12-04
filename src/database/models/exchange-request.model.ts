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

export type ExchangeRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

@Table({ tableName: 'exchange_requests', timestamps: true })
export class ExchangeRequest extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.ENUM('PENDING', 'ACCEPTED', 'REJECTED'),
    allowNull: false,
    defaultValue: 'PENDING',
  })
  declare status: ExchangeRequestStatus;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare requesterId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare responderId: string;

  @ForeignKey(() => Skill)
  @Column({ type: DataType.UUID, allowNull: false })
  declare skillOfferedId: string;

  @ForeignKey(() => Skill)
  @Column({ type: DataType.UUID, allowNull: false })
  declare skillWantedId: string;

  @BelongsTo(() => User, 'requesterId')
  declare requester: User;

  @BelongsTo(() => User, 'responderId')
  declare responder: User;

  @BelongsTo(() => Skill, 'skillOfferedId')
  declare skillOffered: Skill;

  @BelongsTo(() => Skill, 'skillWantedId')
  declare skillWanted: Skill;
}
