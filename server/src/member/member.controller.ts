import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './member.dto';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.memberService.create(createMemberDto);
  }

  @Get('userID/:id')
  findbyUserID(@Param() params: any) {
    return this.memberService.findbyUserID(params.id);
  }
}
