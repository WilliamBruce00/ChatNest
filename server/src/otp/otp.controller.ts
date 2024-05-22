import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OtpService } from './otp.service';
import { CreateOtpDto, UpdateOtpDto } from './otp.dto';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post()
  create(@Body() createOtpDto: CreateOtpDto) {
    return this.otpService.create(createOtpDto);
  }

  @Get(':id')
  findOne(@Param() params: any) {
    return this.otpService.findOne(params.id);
  }

  @Patch(':id')
  update(@Param() params: any, @Body() updateOtpDto: UpdateOtpDto) {
    return this.otpService.update(params.id, updateOtpDto);
  }

  @Delete(':id')
  delete(@Param() params: any) {
    return this.otpService.delete(params.id);
  }
}
