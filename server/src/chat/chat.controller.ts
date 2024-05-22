import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto, UpdateChatDto } from './chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @Patch(':id')
  update(@Param() params: any, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(params.id, updateChatDto);
  }

  @Get('/group/:userId')
  findMessageByGroup(@Param() params: any) {
    return this.chatService.findMessageByGroup(params.userId);
  }

  @Get('/private_message')
  findPrivateMessage(@Query() query: any) {
    return this.chatService.findPrivateMessage(query.sender, query.recipient);
  }

  @Get('/contact/:userId')
  findContact(@Param() params: any) {
    return this.chatService.findContact(params.userId);
  }
}
