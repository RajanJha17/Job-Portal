import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/models/user.schema';
import { UserVerificationSchema } from 'src/models/user-verification.schema';
import { TestAccountsSchema } from 'src/models/test-account.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, { name: "UserVerification", schema: UserVerificationSchema }, { name: "TestAccounts", schema: TestAccountsSchema }])
  ],
  providers: [UserService,JwtService],
  controllers: [UserController]
})
export class UserModule { }
