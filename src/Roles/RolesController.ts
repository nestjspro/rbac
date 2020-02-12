import { HasPermissions }                                                       from '@nestjs.pro/common/dist/decorators/HasPermissions';
import { PermissionsGuard }                                                     from '@nestjs.pro/common/dist/guards/PermissionsGuard';
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags }                                               from '@nestjs/swagger';
import { PermissionsService }                                                   from '../Permissions/PermissionsService';
import { Principal }                                                            from '../types/Principal';
import { PrincipalGuard }                                                       from '../types/PrincipalGuard';
import { User }                                                                 from '../Users/User';
import { Role }                                                                 from './Role';
import { RoleCreate }                                                           from './RoleCreate';
import { RolesService }                                                         from './RolesService';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('/rbac/roles')
export class RolesController {

    private readonly rolesService: RolesService;
    private readonly permissionsService: PermissionsService;

    public constructor(rolesService: RolesService,
                       permissionsService: PermissionsService) {

        this.rolesService = rolesService;
        this.permissionsService = permissionsService;

    }

    @Get()
    @UseGuards(PrincipalGuard, PermissionsGuard)
    @HasPermissions('roles.search')
    public search(@Principal() principal: User): Promise<Array<Role>> {

        return this.rolesService.search(principal.organization);

    }

    @Get('/:roleId')
    @UseGuards(PrincipalGuard, PermissionsGuard)
    @HasPermissions('roles.get')
    public getByOrganizationAndId(@Principal() principal: User, @Param('roleId', ParseUUIDPipe) roleId: string): Promise<Role> {

        return this.rolesService.getByIdAndOrganization(roleId, principal.organization);

    }

    @Delete('/:roleId')
    @UseGuards(PrincipalGuard, PermissionsGuard)
    @HasPermissions('roles.get')
    public deleteByOrganizationAndId(@Principal() principal: User, @Param('roleId', ParseUUIDPipe) roleId: string): Promise<boolean> {

        return this.rolesService.deleteByIdAndOrganization(roleId, principal.organization);

    }

    @Post('/:roleId/permissions/:permissionId')
    @UseGuards(PrincipalGuard, PermissionsGuard)
    @HasPermissions('roles.create')
    public addPermission(@Principal() principal: User, @Param('roleId', ParseUUIDPipe) roleId: string, @Param('permissionId', ParseUUIDPipe) permissionId: string): Promise<Role> {

        return this.rolesService.addPermission(principal, roleId, permissionId);

    }

    @Delete('/:roleId/permissions/:permissionId')
    @UseGuards(PrincipalGuard, PermissionsGuard)
    @HasPermissions('roles.create')
    public permissionRemove(@Principal() principal: User, @Param('roleId', ParseUUIDPipe) roleId: string, @Param('permissionId', ParseUUIDPipe) permissionId: string): Promise<Role> {

        return this.rolesService.permissionRemove(principal.organization, roleId, permissionId);

    }

    @Post('/:roleId/users/:userId')
    @UseGuards(PrincipalGuard, PermissionsGuard)
    @HasPermissions('roles.create')
    public assign(@Principal() principal: User, @Param('roleId', ParseUUIDPipe) roleId: string, @Param('userId', ParseUUIDPipe) userId: string): Promise<boolean> {

        return this.rolesService.assignToUser(principal, roleId, userId);

    }

    @Delete('/:roleId/users/:userId')
    @UseGuards(PrincipalGuard, PermissionsGuard)
    @HasPermissions('roles.delete')
    public unassign(@Principal() principal: User, @Param('roleId', ParseUUIDPipe) roleId: string, @Param('userId', ParseUUIDPipe) userId: string): Promise<boolean> {

        return this.rolesService.unassignFromUser(principal, roleId, userId);

    }

    @Post()
    @UseGuards(PrincipalGuard, PermissionsGuard)
    @HasPermissions('roles.create')
    public create(@Principal() principal: User, @Body() role: RoleCreate): Promise<Role> {

        return this.rolesService.create(principal, role);

    }

}
