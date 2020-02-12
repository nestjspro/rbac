import { Server }    from '@nestjs.pro/common/dist/server/Server';
import { AppModule } from '../src/AppModule';

Server.bootstrap(AppModule, 'rbac', 8181, {

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
    serverUrls: [ 'https://localhost:3000' ]

}, []);
