import { DynamicModule, Module }            from '@nestjs/common';
import { JwtModule }                        from '@nestjs/jwt';
import { TypeOrmModule }                    from '@nestjs/typeorm';
import { RBAC_ENTITIES, RBAC_REPOSITORIES } from './index';
import { OrganizationsController }          from './Organizations/OrganizationsController';
import { OrganizationsService }             from './Organizations/OrganizationsService';
import { PermissionsController }            from './Permissions/PermissionsController';
import { PermissionsService }               from './Permissions/PermissionsService';
import { RBACModuleConfig }                 from './RBACModuleConfig';
import { RolesController }                  from './Roles/RolesController';
import { RolesService }                     from './Roles/RolesService';
import { StartupService }                   from './startup/StartupService';
import { UsersController }                  from './Users/UsersController';
import { UsersService }                     from './Users/UsersService';

@Module({

    imports: [

        JwtModule.register({ secret: 'changeme' }),

        TypeOrmModule.forRoot({

            type: 'mysql',
            host: process.env.DB_HOSTNAME || 'localhost',
            port: Number.parseInt(process.env.DB_PORT) || 3306,
            username: process.env.DB_USERNAME || 'root',
            password: process.env.DB_PASSWORD || 'mysql',
            database: process.env.DB_NAME || 'nestjs',
            synchronize: process.env.DB_SYNCHRONIZE === 'true',
            keepConnectionAlive: true,
            entities: RBAC_ENTITIES

        }),

        TypeOrmModule.forFeature(RBAC_REPOSITORIES),

    ],

    controllers: [

        OrganizationsController,
        PermissionsController,
        RolesController,
        UsersController

    ],

    providers: [

        OrganizationsService,
        PermissionsService,
        RolesService,
        UsersService,

        StartupService

    ],

    exports: [

        OrganizationsService,
        PermissionsService,
        RolesService,
        UsersService

    ]

})
export class RBACModule {

    public static forRoot(options: RBACModuleConfig): DynamicModule {

        return {

            module: RBACModule,
            providers: [

                {

                    provide: 'CONFIG',
                    useValue: options

                }

            ]

        };

    }

}
