import { ElasticsearchLoggerModule }                                          from '@nestjs.pro/logger-elasticsearch/dist/ElasticsearchLoggerModule';
import { DynamicModule, Module }                                              from '@nestjs/common';
import { JwtModule }                                                          from '@nestjs/jwt';
import { TypeOrmModule }                                                      from '@nestjs/typeorm';
import { RBAC_CONTROLLERS, RBAC_ENTITIES, RBAC_PROVIDERS, RBAC_REPOSITORIES } from './index';
import { RBACModuleConfig }                                                   from './RBACModuleConfig';

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
            synchronize: process.env.DB_SYNCHRONIZE === 'true' || true,
            keepConnectionAlive: true,
            entities: RBAC_ENTITIES

        }),

        TypeOrmModule.forFeature(RBAC_REPOSITORIES),

        ElasticsearchLoggerModule.forRoot({

            name: 'rbac',
            index: 'logs',
            stdout: true,
            elasticsearchClientOptions: { nodes: process.env.ELASTICSEARCH_URL }

        })

    ],

    controllers: RBAC_CONTROLLERS,
    providers: RBAC_PROVIDERS,
    exports: RBAC_PROVIDERS

})
export class AppModule {

    public static forRoot(config: RBACModuleConfig): DynamicModule {

        return {

            module: AppModule,

            providers: [

                {

                    provide: 'CONFIG',
                    useValue: config

                }

            ]

        };

    }

}
