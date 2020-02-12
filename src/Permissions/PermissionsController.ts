import { HasPermissions }                                                       from '@nestjs.pro/common/dist/decorators/HasPermissions';
import { PermissionsGuard }                                                     from '@nestjs.pro/common/dist/guards/PermissionsGuard';
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse }       from '@nestjs/swagger';
import { Principal }                                                            from '../types/Principal';
import { PrincipalGuard }                                                       from '../types/PrincipalGuard';
import { User }                                                                 from '../Users/User';
import { Permission }                                                           from './Permission';
import { PermissionCreate }                                                     from './PermissionCreate';
import { PermissionsService }                                                   from './PermissionsService';


@ApiTags('Permissions')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Invalid or expired JWT token.' })
@Controller('/rbac/permissions')
export class PermissionsController {

    /**
     * Permissions service.
     */
    private readonly permissionsService: PermissionsService;

    /**
     * D.I.
     *
     * @param {PermissionsService} permissionsService
     */
    public constructor(permissionsService: PermissionsService) {

        this.permissionsService = permissionsService;

    }

    /**
     * Create a new permission.
     *
     * @param {User} principal
     * @param {PermissionCreate} permissionCreate
     * @returns {Promise<Permission>}
     */
    @Post()
    @UseGuards(PrincipalGuard, PermissionsGuard)
    @HasPermissions('permissions.create')
    public create(@Principal() principal: User, @Body() permissionCreate: PermissionCreate): Promise<Permission> {

        return this.permissionsService.create(principal, permissionCreate);

    }

    /**
     * Delete an existing permission by it's owning organization and id.
     *
     * @param principal
     * @param {string} permissionId
     *
     * @returns {Promise<boolean>}
     */
    @ApiOkResponse({ description: 'Returns "true" if successful.' })
    @Delete('/:permissionId')
    @UseGuards(PrincipalGuard, PermissionsGuard)
    @HasPermissions('permissions.delete')
    public deleteByOrganizationAndId(@Principal() principal: User, @Param('permissionId', ParseUUIDPipe) permissionId: string): Promise<boolean> {

        return this.permissionsService.deleteByOrganizationAndId(principal, permissionId);

    }

    /**
     * Retrieve all permissions by owning organization.
     *
     * @param {User} principal
     *
     * @returns {Promise<Array<Permission>>}
     */
    @ApiOkResponse({ description: 'Returns an array of permissions.' })
    @Get()
    @UseGuards(PrincipalGuard, PermissionsGuard)
    @HasPermissions('permissions.search')
    public getByOrganization(@Principal() principal: User): Promise<Array<Permission>> {

        return this.permissionsService.getByOrganization(principal.organization);

    }

}
