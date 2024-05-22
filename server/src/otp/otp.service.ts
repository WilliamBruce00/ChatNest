import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Otp } from './otp.schema';
import mongoose, { Model } from 'mongoose';
import { CreateOtpDto, UpdateOtpDto } from './otp.dto';

@Injectable()
export class OtpService {
  constructor(@InjectModel(Otp.name) private otpModel: Model<Otp>) {}

  async create(createOtpDto: CreateOtpDto): Promise<CreateOtpDto> {
    try {
      const otp = new this.otpModel(createOtpDto);
      return await otp.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string): Promise<CreateOtpDto> {
    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid) {
      throw new NotFoundException();
    }

    const otp = await this.otpModel.findOne({ _id: id });

    if (!otp) {
      throw new NotFoundException();
    }

    return otp;
  }

  async update(id: string, updateOtpDto: UpdateOtpDto): Promise<CreateOtpDto> {
    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid) {
      throw new NotFoundException();
    }

    const otp = await this.otpModel.findByIdAndUpdate(
      { _id: id },
      { ...updateOtpDto, exp: new Date(Date.now() + 120000).toISOString() },
      { new: true },
    );

    return otp;
  }

  async delete(id: string): Promise<string> {
    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid) {
      throw new NotFoundException();
    }

    const otp = await this.otpModel.findByIdAndDelete({ _id: id });

    if (!otp) {
      throw new NotFoundException();
    }

    return JSON.stringify({
      statusCode: HttpStatus.OK,
      message: `Deleted Otp id ${otp._id} successfully`,
    });
  }
}
