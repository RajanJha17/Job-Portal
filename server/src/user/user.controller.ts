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
        return this.userService.registerUser(body.name,body.email, body.password, body.newsletter, body.mailContent);
    } 

    @Post('/verify')
    verifyUser(@Body() body) {
        return this.userService.verifyUser(body.token);
    }

    @Post('/login')
    loginUser(@Body() body) {
        return this.userService.loginUser(body.email, body.password, body.mailContent);
    }
}
