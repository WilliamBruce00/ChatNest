import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Friend } from './friend.schema';
import mongoose, { Model } from 'mongoose';
import { CreateFriendDto } from './friend.dto';

@Injectable()
export class FriendService {
  constructor(@InjectModel(Friend.name) private friendModel: Model<Friend>) {}

  async create(createFriendDto: CreateFriendDto): Promise<CreateFriendDto> {
    const friend = new this.friendModel(createFriendDto);
    return await friend.save();
  }

  async findbyUserID(id: string): Promise<CreateFriendDto[]> {
    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid) {
      throw new NotFoundException();
    }

    const friend = await this.friendModel.find({ userID: id });

    if (!friend) {
      throw new NotFoundException();
    }
    return friend;
  }

  async delete(id: string): Promise<string> {
    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid) {
      throw new NotFoundException();
    }

    await this.friendModel.findByIdAndDelete({ _id: id }, { new: true });

    return JSON.stringify({
      statusCode: 200,
      message: 'success',
    });
  }
}
