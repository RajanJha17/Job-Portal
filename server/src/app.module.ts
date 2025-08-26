import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      
      isGlobal: true,
      validationSchema:Joi.object({
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL!),
    MailerModule.forRoot({
      transport: `smtp://${process.env.EMAIL_ADDRESS}:${process.env.EMAIL_PASSWORD}@${process.env.EMAIL_HOST}`,
      defaults:{
        from: `"No Reply" <${process.env.EMAIL_ADDRESS}>`,
        tls:{
          rejectUnauthorized:false
        },
        secure:true
      }
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
