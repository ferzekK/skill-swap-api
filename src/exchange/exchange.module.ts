import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';
import { ExchangeRequest } from '../database/models/exchange-request.model';
import { SkillsModule } from '../skills/skills.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ExchangeRequest]),
    UsersModule,
    SkillsModule,
  ],
  controllers: [ExchangeController],
  providers: [ExchangeService],
  exports: [ExchangeService],
})
export class ExchangeModule {}
