import { RabbitMQModule }                   from '@nestjs-plus/rabbitmq';
import { DynamicModule, Module }            from '@nestjs/common';
import { JwtModule }                        from '@nestjs/jwt';
import { TypeOrmModule }                    from '@nestjs/typeorm';
import * as dotenv                          from 'dotenv';
import { RBAC_ENTITIES, RBAC_REPOSITORIES } from './index';
import { OrganizationsController }          from './Organizations/OrganizationsController';
import { OrganizationsMessageBus }          from './Organizations/OrganizationsMessageBus';
import { OrganizationsService }             from './Organizations/OrganizationsService';
import { PermissionsController }            from './Permissions/PermissionsController';
import { PermissionsService }               from './Permissions/PermissionsService';
import { RBACModuleConfig }                 from './RBACModuleConfig';
import { RolesController }                  from './Roles/RolesController';
import { RolesMessageBus }                  from './Roles/RolesMessageBus';
import { RolesService }                     from './Roles/RolesService';
import { StartupService }                   from './startup/StartupService';
import { TokensController }                 from './Tokens/TokensController';
import { TokensService }                    from './Tokens/TokensService';
import { UsersController }                  from './Users/UsersController';
import { UsersMessageBus }                  from './Users/UsersMessageBus';
import { UsersService }                     from './Users/UsersService';

dotenv.config();

@Module({

    imports: [

        JwtModule.register({ secret: 'changeme' }),

        RabbitMQModule.forRoot({

            exchanges: [ { name: process.env.RABBITMQ_EXCHANGE, type: 'topic' } ],
            uri: process.env.RABBITMQ_URI

        }),

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

    providers: [

        OrganizationsService,
        OrganizationsMessageBus,
        PermissionsService,
        RolesService,
        RolesMessageBus,
        TokensService,
        UsersService,
        UsersMessageBus,
        StartupService

    ],

    exports: [

        OrganizationsService,
        PermissionsService,
        RolesService,
        TokensService,
        UsersService

    ]

})
export class RBACModule {

    public static forRoot(options: RBACModuleConfig): DynamicModule {

        const controllers = options.enableControllers ? [

            OrganizationsController,
            PermissionsController,
            RolesController,
            TokensController,
            UsersController

        ] : null;

        return {

            module: RBACModule,
            providers: [

                {

                    provide: 'CONFIG',
                    useValue: options

                }

            ],
            controllers

        };

    }

}
