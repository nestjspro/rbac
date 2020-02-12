import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Request, Response }                                 from 'express';

import * as jwt          from 'jsonwebtoken';
import { TokensService } from '../Tokens/TokensService';
import { UsersService }  from '../Users/UsersService';

/**
 * Principal Guard for protecting routes and automatically retrieving the users profile.
 */
@Injectable()
export class PrincipalGuard implements CanActivate {

    public constructor(@Inject('UsersService') private readonly usersService: UsersService,
                       @Inject('TokensService') private readonly tokensService: TokensService) {

    }

    /**
     * Called before a route is executed.
     *
     * @param {ExecutionContext} context
     * @returns {Promise<boolean>}
     */
    public canActivate(context: ExecutionContext): Promise<boolean> {

        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        if (request.headers.authorization) {

            return new Promise<boolean>(async (resolve, reject) => {

                const split = request.headers.authorization.split(' ');

                if (split[ 0 ] == 'token') {

                    const token = await this.tokensService.getByToken(split[ 1 ]).catch(() => {

                        response.status(401).json({ message: 'invalid or expired token' });

                    });

                    if (token) {

                        request[ 'principal' ] = token.user;

                        resolve(true);

                    } else {

                        response.status(401).json({ message: 'invalid or expired token' });

                    }

                } else {

                    try {

                        const decoded = jwt.verify(split[ 1 ], process.env.JWT_SECRET || 'change');
                        const user = await this.usersService.getById(decoded[ 'id' ]);

                        if (user) {

                            request[ 'principal' ] = user;

                            resolve(true);

                        } else {

                            response.status(401).json({ message: 'invalid or expired token' });

                        }

                    } catch (e) {

                        response.status(401).json({ message: 'invalid or expired token' });

                    }

                }

            });

        } else {

            response.status(401).json({ message: 'invalid or expired token' });

        }

    }

}
