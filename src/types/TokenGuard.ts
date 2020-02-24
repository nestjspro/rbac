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

        console.log(`Validating token "${ request.query[ 'token' ] }`);

        if (request.query[ 'token' ]) {

            return new Promise<boolean>(async (resolve, reject) => {

                const token = await this.tokensService.getByToken(request.query[ 'token' ]).catch(() => {

                });

                if (token) {

                    request[ 'principal' ] = token.user;

                    resolve(true);

                } else {

                    response.status(401).json({ message: 'invalid or expired token' });

                }

            });

        } else {

            response.status(401).json({ message: 'missing token' });

        }

    }

}
