import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from './member.schema';
import { Model } from 'mongoose';
import { CreateMemberDto } from './member.dto';

@Injectable()
export class MemberService {
  constructor(@InjectModel(Member.name) private memberModel: Model<Member>) {}

  async create(createMemberDto: CreateMemberDto): Promise<CreateMemberDto> {
    const member = new this.memberModel(createMemberDto);
    return await member.save();
  }

  async findbyUserID(userId: string) {
    const member = await this.memberModel.find({
      userID: userId,
    });
    return member;
  }
}
