import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomMessages } from 'src/constant/custom-messages';

import CustomResponse from 'src/response/custom-response';
import * as crypto from 'crypto';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { v4 as uuid } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/models/user/user.schema';
import { UserVerification } from 'src/models/user/user-verification.schema';
import { TestAccounts } from 'src/models/user/test-account.schema';

const TEST_ACCOUNT_EMAIL = 'work@jooob.eu';



@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        private readonly mailerService: MailerService,
        @InjectModel(UserVerification.name)
        private readonly userVerificationModel: Model<UserVerification>,
        @InjectModel(TestAccounts.name)
        private readonly testAccountsModel: Model<TestAccounts>,
        private readonly jwtTokenService: JwtService,

    ) { }

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
            console.log("Email for sending:", email);

            await this.mailerService.sendMail({
                to: email,
                from: `"No Reply" <${process.env.EMAIL_ADDRESS}>`,
                subject: content[1],
                html: `<div>
                  <h2>${content[2]}</h2>
                  <p>${content[3]}</p>
                  <a href="${process.env.WEBSITE_URL}/verify?token=${token}">
                    ${process.env.WEBSITE_URL}/verify?token=${token}
                  </a>
               </div>`,
            })

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

    async verifyUser(token: string) {
        try {
            const user = await this.userVerificationModel.findOne({ token });
            if (!user) {
                return new CustomResponse({
                    data: null,
                    message: CustomMessages.USER_NOT_FOUND,
                    statusCode: HttpStatus.NOT_FOUND
                })
            }

            await this.userModel.updateOne({ email: user.email }, { active: true })
            await this.userVerificationModel.deleteOne({ token })
            return new CustomResponse({
                data: {
                    user: user
                },
                message: CustomMessages.USER_VERIFIED_SUCCESSFULLY,
                statusCode: HttpStatus.OK,
            })
        } catch (error) {
            console.error("Error in verifyUser:", error);
            return new CustomResponse({
                data: null,
                message: error.message || CustomMessages.SOMETHING_WENT_WRONG,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            })
        }

    }

    async loginUser(email: string, password: string, mailContent: string) {
        const payload = { username: email, sub: password, role: 'user' };
        const content = JSON.parse(mailContent);

        if (email === TEST_ACCOUNT_EMAIL) {
            const user = await this.testAccountsModel.findOne({ email }).exec();
            if (user) {
                if (new Date(user.expire_date) > new Date()) {
                    const access_token = await this.jwtTokenService.sign(payload, {
                        secret: process.env.JWT_SECRET,
                    })
                    return new CustomResponse({
                        data: {
                            access_token
                        },
                        message: CustomMessages.USER_LOGIN_SUCCESSFULLY,
                        statusCode: HttpStatus.OK,
                    })

                } else {
                    return new CustomResponse({
                        data: null,
                        message: CustomMessages.TEST_ACCOUNT_EXPIRED,
                        statusCode: HttpStatus.NOT_FOUND,
                    })
                }
            } else {
                return new CustomResponse({
                    data: null,
                    message: CustomMessages.USER_NOT_FOUND,
                    statusCode: HttpStatus.NOT_FOUND,
                })
            }
        } else {
            const passwordHash = await crypto.createHash('sha256').update(password).digest('hex');
            const user = await this.userModel.findOne({
                email,
                password: passwordHash
            })
            if (user) {
                if (user.active) {
                    if (!user.blocked) {
                        const access_token = await this.jwtTokenService.sign(payload, {
                            secret: process.env.JWT_SECRET,
                        })
                        return new CustomResponse({
                            data: {
                                access_token
                            },
                            message: CustomMessages.USER_LOGIN_SUCCESSFULLY,
                            statusCode: HttpStatus.OK,
                        })
                    } else {
                        return new CustomResponse({
                            data: null,
                            message: CustomMessages.USER_BLOCKED,
                            statusCode: HttpStatus.NOT_FOUND,
                        })
                    }
                } else {
                    return new CustomResponse({
                        data: null,
                        message: CustomMessages.USER_NOT_ACTIVE,
                        statusCode: HttpStatus.NOT_FOUND,
                    })
                }
            } else {
                return new CustomResponse({
                    data: null,
                    message: CustomMessages.USER_NOT_FOUND,
                    statusCode: HttpStatus.NOT_FOUND,
                })
            }
        }

    }

    async sendInvitation(){

    }
}
