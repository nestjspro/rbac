import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Request, Response }                                 from 'express';
import { TokensService }                                     from '../Tokens/TokensService';

/**
 * Principal Guard for protecting routes and automatically retrieving the users profile.
 */
@Injectable()
export class TokenGuard implements CanActivate {

    public constructor(@Inject('TokensService') private readonly tokensService: TokensService) {

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

                console.log(`Validating token "${ request.query[ 'token' ] }`);

                console.log(await this.tokensService.getByToken(request.query[ 'token' ]));

                const token = await this.tokensService.getByToken(request.query[ 'token' ]).catch(() => {

                });

                console.log(token);

                if (token) {

                    request[ 'principal' ] = token.user;

                    resolve(true);

                } else {

                    response.status(401).json({ message: 'invalid or expired token' });

                }

            });

        } else {

            response.status(401).json({ message: 'invalid or expired token' });

        }

    }

}
