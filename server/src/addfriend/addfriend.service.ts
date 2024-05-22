import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AddFriend } from './addfriend.schema';
import mongoose, { Model } from 'mongoose';
import { CreateAddFriendDto, UpdateAddFriendDto } from './addfriend.dto';

@Injectable()
export class AddfriendService {
  constructor(
    @InjectModel(AddFriend.name) private addFriendModel: Model<AddFriend>,
  ) {}

  async create(
    createAddFriendDto: CreateAddFriendDto,
  ): Promise<CreateAddFriendDto> {
    const addfriend = new this.addFriendModel(createAddFriendDto);
    return await addfriend.save();
  }

  async findOne(id: string): Promise<CreateAddFriendDto> {
    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid) {
      throw new NotFoundException();
    }

    const addfriend = await this.addFriendModel.findOne({ _id: id });

    if (!addfriend) {
      throw new NotFoundException();
    }
    return addfriend;
  }

  async findbyRecipient(id: string): Promise<CreateAddFriendDto[]> {
    const addfriend = await this.addFriendModel.find({
      recipient: id,
    });
    return addfriend;
  }

  async findbySender(id: string): Promise<CreateAddFriendDto[]> {
    const addfriend = await this.addFriendModel.find({
      sender: id,
    });
    return addfriend;
  }

  async delete(id: string): Promise<string> {
    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid) {
      throw new NotFoundException();
    }

    await this.addFriendModel.findByIdAndDelete({ _id: id }, { new: true });

    return JSON.stringify({
      status: 200,
      message: 'Success',
    });
  }

  async update(
    id: string,
    updateAddFriendDto: UpdateAddFriendDto,
  ): Promise<CreateAddFriendDto> {
    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid) {
      throw new NotFoundException();
    }

    const addfriend = await this.addFriendModel.findByIdAndUpdate(
      { _id: id },
      { ...updateAddFriendDto },
      { new: true },
    );
    return addfriend;
  }
}
