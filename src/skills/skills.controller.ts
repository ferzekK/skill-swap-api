import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { SkillsService } from './skills.service';
import { Skill } from '../database/models';
import {
  CreateSkillDto,
  UpdateSkillDto,
} from '../shared/dtos/create-skill.dto';

@ApiTags('skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new skill' })
  @ApiCreatedResponse({ description: 'Skill created successfully' })
  async create(@Body() createSkillDto: CreateSkillDto): Promise<Skill> {
    return this.skillsService.create(createSkillDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all skills' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name' })
  @ApiOkResponse({ description: 'List of skills' })
  async findAll(@Query('search') search?: string): Promise<Skill[]> {
    if (search) {
      return this.skillsService.search(search);
    }
    return this.skillsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get skill by ID' })
  @ApiParam({ name: 'id', description: 'Skill UUID' })
  @ApiOkResponse({ description: 'Skill data' })
  @ApiNotFoundResponse({ description: 'Skill not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Skill> {
    return this.skillsService.findOneOrThrow(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update skill' })
  @ApiParam({ name: 'id', description: 'Skill UUID' })
  @ApiOkResponse({ description: 'Skill updated successfully' })
  @ApiNotFoundResponse({ description: 'Skill not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ): Promise<Skill> {
    return this.skillsService.update(id, updateSkillDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete skill' })
  @ApiParam({ name: 'id', description: 'Skill UUID' })
  @ApiNotFoundResponse({ description: 'Skill not found' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.skillsService.delete(id);
  }
}
