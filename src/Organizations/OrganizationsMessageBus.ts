import { RabbitRPC }            from '@nestjs-plus/rabbitmq';
import { MessagingMethod }      from '@nestjs.pro/common/dist/messaging/MessagingMethod';
import { Injectable }           from '@nestjs/common';
import { OrganizationsService } from './OrganizationsService';

@Injectable()
export class OrganizationsMessageBus {


    public constructor(private readonly organizationsService: OrganizationsService) {

    }

    @RabbitRPC({

        exchange: 'streamnvr',
        routingKey: 'organizations',
        queue: 'organizations'

    })
    public async handleMessage(methodCall: MessagingMethod) {

        console.log(methodCall);

        if (this.organizationsService[ methodCall.methodName ]) {

            return this.organizationsService[ methodCall.methodName ](methodCall.args).catch(e => console.log(e));

        } else {

            return 'method not found';

        }

    }

}
