import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<CreateUserDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: any): Promise<CreateUserDto> {
    return this.userService.findOne(params.id);
  }

  @Patch(':id')
  update(
    @Param() params: any,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<CreateUserDto> {
    return this.userService.update(params.id, updateUserDto);
  }

  @Delete(':id')
  delete(@Param() params: any): Promise<string> {
    return this.userService.delete(params.id);
  }

  @Get('/email/:email')
  findEmail(@Param() params: any): Promise<CreateUserDto> {
    return this.userService.findEmail(params.email);
  }

  @Get('/search/:keyword')
  searchKeyword(@Param() params: any): Promise<CreateUserDto[]> {
    return this.userService.searchKeyword(params.keyword);
  }
}
