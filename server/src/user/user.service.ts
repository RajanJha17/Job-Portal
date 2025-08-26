import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomMessages } from 'src/constant/custom-messages';
import { User } from 'src/models/user.schema';
import CustomResponse from 'src/response/custom-response';
import * as crypto from 'crypto';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { v4 as uuid } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import { UserVerification } from 'src/models/user-verification.schema';


@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel:Model<User>,
        private readonly mailerService: MailerService,
        @InjectModel(UserVerification.name)
        private readonly userVerificationModel: Model<UserVerification>,
    ){}

    async registerUser(name: string, email: string, password: string, newsletter: boolean, mailContent: string) {
        try {
            const existingUser = await this.userModel.findOne({ email });
            if (existingUser) {
                return new CustomResponse({
                    data: existingUser,
                    message: CustomMessages.USER_ALREADY_EXISTS,
                    statusCode: HttpStatus.OK
                })
            }

            const content = JSON.parse(mailContent);
            const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
            const newUser = new this.userModel({
                name,
                email,
                password: passwordHash,
                data: '{}'
            })

            const token = await uuid();
            // await this.mailerService.sendMail({
            //     to: email,
            //     from: `"No Reply" <${process.env.EMAIL_ADDRESS}>`,
            //     subject: content[1],
            //     html: `<div>
            //       <h2>${content[2]}</h2>
            //       <p>${content[3]}</p>
            //       <a href="${process.env.WEBSITE_URL}/weryfikacja?token=${token}">
            //         ${process.env.WEBSITE_URL}/weryfikacja?token=${token}
            //       </a>
            //    </div>`,
            // })

            await newUser.save();

            const userVerification = await this.userVerificationModel.create({
                email,
                token
            })

            return new CustomResponse({
                data: {
                    user: newUser

                },
                message: CustomMessages.USER_REGISTERED_SUCCESSFULLY,
                statusCode: HttpStatus.CREATED,
            })
        } catch (error) {
            console.error("Error in registerUser:", error);
    return new CustomResponse({
      data: null,
      message: error.message || CustomMessages.SOMETHING_WENT_WRONG,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });

        }






    }
}
