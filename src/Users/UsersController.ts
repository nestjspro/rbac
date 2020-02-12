import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Response,
    UnauthorizedException,
    UseGuards,
    UseInterceptors
}                                 from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as jwt                   from 'jsonwebtoken';
import { Principal }              from '../types/Principal';
import { PrincipalGuard }         from '../types/PrincipalGuard';
import { User }                   from './User';
import { UserLogin }              from './UserLogin';
import { UserPassword }           from './UserPassword';
import { UserRegister }           from './UserRegister';
import { UsersService }           from './UsersService';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('/rbac/users')
export class UsersController {

    public static JWT_TOKEN = 'change';
    public static JWT_EXPIRY = 86400;

    public constructor(private usersService: UsersService) {

    }

    /**
     * Endpoint to perform login with an email address and password.
     * When successful a JWT token will be returned.
     *
     * @param response
     * @param {UserLogin} login
     *
     * @returns {Promise<(req: http.IncomingMessage, res: http.ServerResponse, next: createServer.NextFunction) => void>}
     *
     * @throws UnauthorizedException Thrown if the login credentials are invalid.
     */
    @Post('/login')
    public async login(@Response() response, @Body() login: UserLogin) {

        const user = await this.usersService.getByEmail(login.email);

        if (user) {

            const token = jwt.sign({ id: user.id }, UsersController.JWT_TOKEN, { expiresIn: UsersController.JWT_EXPIRY });

            return response.status(HttpStatus.OK).json({ expiresIn: UsersController.JWT_EXPIRY, token });

        } else {

            throw new UnauthorizedException();

        }

    }

    /**
     * Creates a new user.
     *
     * @param {UserRegister} userRegister
     *
     * @returns {Promise<string>}
     */
    @Post('/register')
    public async register(@Body() userRegister: UserRegister): Promise<string> {

        const user = await this.usersService.register(userRegister);

        console.log(user);

        if (user) {

            return 'OK';

        } else {

            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

        }

    }

    /**
     * Retrieve the current logged in users profile.
     *
     * @param {Principal} principal
     *
     * @returns {Promise<User>}
     */
    @Get('/my')
    @UseGuards(PrincipalGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    public async getMyProfile(@Principal() principal: User): Promise<User> {

        return this.usersService.getById(principal.id);

    }

    /**
     * Sends a reset password email.
     *
     * @param {string} email
     *
     * @returns {Promise<boolean>}
     */
    // @Post('/reset/send')
    // public forgotSend(@Query('email')  email: string): Promise<boolean> {
    //
    //     return this.usersService.resetSend(email);
    //
    // }

    /**
     * Change password if token matches.
     *
     * @param {string} token
     * @param {UserPassword} userPassword
     *
     * @returns {Promise<boolean>}
     */
    // @Post('/reset/submit')
    // public resetSubmit(@Query('token') token: string, @Body() userPassword: UserPassword): Promise<boolean> {
    //
    //     return this.usersService.resetSubmit(token, userPassword.password);
    //
    // }

    @Post('/changePassword')
    @UseGuards(PrincipalGuard)
    public changePassword(@Principal() user: User, @Body() changePassword: UserPassword): Promise<User> {

        return this.usersService.changePassword(user, changePassword);

    }

}
