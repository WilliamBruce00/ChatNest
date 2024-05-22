import { Module } from '@nestjs/common';
import { AddfriendController } from './addfriend.controller';
import { AddfriendService } from './addfriend.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AddFriend, AddFriendSchema } from './addfriend.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AddFriend.name, schema: AddFriendSchema },
    ]),
  ],
  controllers: [AddfriendController],
  providers: [AddfriendService],
})
export class AddfriendModule {}
