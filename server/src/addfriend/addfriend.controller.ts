import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AddfriendService } from './addfriend.service';
import { CreateAddFriendDto, UpdateAddFriendDto } from './addfriend.dto';

@Controller('addfriend')
export class AddfriendController {
  constructor(private readonly addFriendService: AddfriendService) {}

  @Post()
  create(@Body() createAddFriendDto: CreateAddFriendDto) {
    return this.addFriendService.create(createAddFriendDto);
  }

  @Get(':id')
  findOne(@Param() params: any) {
    return this.addFriendService.findOne(params.id);
  }

  @Get('/recipient/:id')
  findbyRecipient(@Param() params: any) {
    return this.addFriendService.findbyRecipient(params.id);
  }

  @Get('/sender/:id')
  findbySender(@Param() params: any) {
    return this.addFriendService.findbySender(params.id);
  }

  @Delete(':id')
  delete(@Param() params: any) {
    return this.addFriendService.delete(params.id);
  }

  @Patch(':id')
  update(@Param() params: any, @Body() updateAddFriendDto: UpdateAddFriendDto) {
    return this.addFriendService.update(params.id, updateAddFriendDto);
  }
}
