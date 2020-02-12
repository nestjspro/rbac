import { HasPermissions }                                                       from '@nestjs.pro/common/dist/decorators/HasPermissions';
import { PermissionsGuard }                                                     from '@nestjs.pro/common/dist/guards/PermissionsGuard';
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags }                                               from '@nestjs/swagger';
import { Principal }                                                            from '../types/Principal';
import { PrincipalGuard }                                                       from '../types/PrincipalGuard';
import { User }                                                                 from '../Users/User';
import { Token }                                                                from './Token';
import { TokenCreate }                                                          from './TokenCreate';
import { TokensService }                                                        from './TokensService';

@ApiTags('Tokens')
@ApiBearerAuth()
@Controller('/rbac/tokens')
export class TokensController {

    public constructor(private readonly tokensService: TokensService) {

    }

    @Get('/:token')
    public getByToken(@Param('token') token: string): Promise<Token> {

        return this.tokensService.getByToken(token);

    }

    @Get()
    @HasPermissions('rbac.tokens.search')
    @UseGuards(PrincipalGuard, PermissionsGuard)
    public search(@Principal() principal: User): Promise<Array<Token>> {

        return this.tokensService.search(principal.organization);

    }

    @Post()
    @HasPermissions('rbac.tokens.create')
    @UseGuards(PrincipalGuard, PermissionsGuard)
    public create(@Principal() principal: User, @Body() tokenCreate: TokenCreate): Promise<Token> {

        return this.tokensService.create(principal, tokenCreate);

    }

    @Delete('/:id')
    @HasPermissions('rbac.tokens.delete')
    @UseGuards(PrincipalGuard, PermissionsGuard)
    public deleteByIdAndOrganization(@Principal() principal: User, @Param('id', ParseUUIDPipe) id: string): Promise<boolean> {

        return this.tokensService.deleteByIdAndOrganization(id, principal.organization);

    }

}
