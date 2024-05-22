import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './group.schema';
import mongoose, { Model } from 'mongoose';
import { CreateGroupDto } from './group.dto';

@Injectable()
export class GroupService {
  constructor(@InjectModel(Group.name) private groupModel: Model<Group>) {}

  create(createDtoGroup: CreateGroupDto): Promise<CreateGroupDto> {
    const group = new this.groupModel(createDtoGroup);
    return group.save();
  }

  async findOne(id: string): Promise<CreateGroupDto> {
    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid) {
      throw new NotFoundException();
    }

    const group = await this.groupModel.findOne({ _id: id });
    return group;
  }
}
