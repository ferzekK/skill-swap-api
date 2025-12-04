import { Module } from '@nestjs/common';

import { ExchangeModule } from './exchange/exchange.module';
import { SkillsModule } from './skills/skills.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, SkillsModule, ExchangeModule],
})
export class AppModule {}
