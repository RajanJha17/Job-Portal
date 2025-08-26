import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/models/user.schema';
import { UserVerificationSchema } from 'src/models/user-verification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema },{name:"UserVerification", schema: UserVerificationSchema}])
  ],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
