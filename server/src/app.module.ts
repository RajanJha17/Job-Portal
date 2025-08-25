import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      
      isGlobal: true,
      validationSchema:Joi.object({
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL!),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
