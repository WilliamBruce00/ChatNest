import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FriendService } from './friend.service';
import { CreateFriendDto } from './friend.dto';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendservice: FriendService) {}

  @Get('userID/:id')
  findbyUserID(@Param() params: any) {
    return this.friendservice.findbyUserID(params.id);
  }

  @Post()
  create(@Body() createFriendDto: CreateFriendDto) {
    return this.friendservice.create(createFriendDto);
  }

  @Delete(':id')
  delete(@Param() params: any) {
    return this.friendservice.delete(params.id);
  }
}
