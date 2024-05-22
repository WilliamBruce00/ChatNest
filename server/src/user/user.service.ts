import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(data: CreateUserDto): Promise<CreateUserDto> {
    try {
      const hash = await bcrypt.hash(data.password, 10);
      const user = new this.userModel({ ...data, password: hash });
      return await user.save();
    } catch (error) {
      throw new HttpException('Email duplicate key', HttpStatus.CONFLICT);
    }
  }

  async findAll(): Promise<CreateUserDto[]> {
    try {
      const user = await this.userModel.find();
      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<CreateUserDto> {
    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid) {
      throw new NotFoundException('User Not Found');
    }
    const user = await this.userModel.findOne({ _id: id });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<CreateUserDto> {
    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid) {
      throw new NotFoundException('User Not Found');
    }

    const user = await this.userModel.findByIdAndUpdate(
      { _id: id },
      { ...updateUserDto },
      { new: true },
    );

    return user;
  }

  async delete(id: string): Promise<string> {
    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid) {
      throw new NotFoundException();
    }

    const user = await this.userModel.findByIdAndDelete(
      { _id: id },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException();
    }

    return JSON.stringify({
      statusCode: HttpStatus.OK,
      message: `Delete User ID ${user._id} Successfully`,
    });
  }

  async findEmail(email: string): Promise<CreateUserDto> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async searchKeyword(keyword: string): Promise<CreateUserDto[]> {
    const users = await this.userModel.find({
      $or: [
        {
          fullname: { $regex: keyword, $options: 'i' },
        },
      ],
    });

    return users;
  }
}
