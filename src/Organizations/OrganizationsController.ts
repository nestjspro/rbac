import { ElasticsearchRequestInterceptor }         from '@nestjs.pro/logger-elasticsearch/dist/ElasticsearchRequestInterceptor';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags }                  from '@nestjs/swagger';
import { Organization }                            from './Organization';
import { OrganizationCreate }                      from './OrganizationCreate';
import { OrganizationsService }                    from './OrganizationsService';

@ApiBearerAuth()
@ApiTags('Organizations')
@UseInterceptors(ElasticsearchRequestInterceptor)
@Controller('/rbac/organizations')
export class OrganizationsController {

    private readonly organizationsService: OrganizationsService;

    public constructor(organizationsService: OrganizationsService) {

        this.organizationsService = organizationsService;

    }

    @Post()
    // @UseGuards(PrincipalGuard, PermissionsGuard)
    // @HasPermissions('rbac.organizations.create')
    public create(@Body() organizationCreate: OrganizationCreate): Promise<Organization> {

        return this.organizationsService.create(organizationCreate);

    }

}
