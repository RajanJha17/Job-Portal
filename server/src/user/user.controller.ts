import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){
    }
    @Post('/register')
    registerUser(@Body() body){
        this.userService.registerUser(body.name,body.email, body.password, body.newsletter, body.mailContent);
    } 
}
