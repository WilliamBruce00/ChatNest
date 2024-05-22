import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './group.dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @Get(':id')
  findOne(@Param() params: any) {
    return this.groupService.findOne(params.id);
  }
}
