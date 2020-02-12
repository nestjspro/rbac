import { Server }    from '@nestjs.pro/common/dist/server/Server';
import { AppModule } from './AppModule';

Server.bootstrap(AppModule, 'swagger', 8181, {

    path: 'rbac',
    title: 'RBAC',
    description: 'Role Based Access Control',
    version: '0.0.1',
    tags: [],
    // tags: [ 'Organizations', 'Permissions', 'Roles', 'Users' ],
    contactName: 'Matthew Davis',
    contactEmail: 'matthew@matthewdavis.io',
    contactUrl: 'https://matthewdavis.io',
    docsDescription: 'docs',
    docsUrl: 'https://matthewdavis.io',
    serverUrls: [ 'http://localhost:8181' ]

}, []);
