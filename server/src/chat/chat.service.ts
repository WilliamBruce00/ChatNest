import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './chat.schema';
import mongoose, { Model } from 'mongoose';
import { CreateChatDto, UpdateChatDto } from './chat.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    private readonly userService: UserService,
  ) {}

  async create(data: CreateChatDto): Promise<CreateChatDto> {
    const chat = new this.chatModel(data);
    return await chat.save();
  }

  async update(id: string, data: UpdateChatDto): Promise<CreateChatDto> {
    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid) {
      throw new NotFoundException();
    }

    const chat = await this.chatModel.findByIdAndUpdate(
      { _id: id },
      { ...data },
      { new: true },
    );

    return chat;
  }

  async findMessageByGroup(userId: string): Promise<Chat[]> {
    const chat = await this.chatModel.find({
      recipient: userId,
    });

    return chat;
  }

  async findPrivateMessage(sender: string, recipient: string): Promise<Chat[]> {
    const [m1, m2] = await Promise.all([
      this.chatModel.find({
        sender: sender,
        recipient: recipient,
      }),
      this.chatModel.find({
        sender: recipient,
        recipient: sender,
      }),
    ]);

    return [...m1, ...m2].sort(
      (a: any, b: any) =>
        new Date(b.createAt).getTime() - new Date(a.createAt).getTime(),
    );
  }

  async findContact(userId: string): Promise<any> {
    const include = ['message', 'image', 'file'];

    const [chat1, chat2] = await Promise.all([
      this.chatModel.find({ recipient: userId }),
      this.chatModel.find({ sender: userId }),
    ]);
    return [
      ...new Set(
        [...chat1, ...chat2]
          .filter((item: Chat) => include.includes(item.type))
          .map((item: Chat) => {
            if (item.sender === userId) {
              return item.recipient;
            } else {
              return item.sender;
            }
          }),
      ),
    ];
  }
}
