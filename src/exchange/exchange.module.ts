import { Module } from '@nestjs/common';

import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';
import { SkillsModule } from '../skills/skills.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, SkillsModule],
  controllers: [ExchangeController],
  providers: [ExchangeService],
  exports: [ExchangeService],
})
export class ExchangeModule {}
