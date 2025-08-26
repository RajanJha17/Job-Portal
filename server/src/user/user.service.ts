import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/user.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel:Model<User>
    ){}

    async registerUser(name:string,email: string, password: string, newsletter: boolean, mailContent: string){
        const existingUser=await this.userModel.findOne({email});
        

    }
}
