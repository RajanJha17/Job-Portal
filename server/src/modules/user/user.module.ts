import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserSchema } from 'src/models/user/user.schema';
import { UserVerificationSchema } from 'src/models/user/user-verification.schema';
import { TestAccountsSchema } from 'src/models/user/test-account.schema';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, { name: "UserVerification", schema: UserVerificationSchema }, { name: "TestAccounts", schema: TestAccountsSchema }])
  ],
  providers: [UserService,JwtService],
  controllers: [UserController]
})
export class UserModule { }
