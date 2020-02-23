import { RabbitRPC }       from '@nestjs-plus/rabbitmq';
import { MessagingMethod } from '@nestjs.pro/common/dist/messaging/MessagingMethod';
import { Injectable }      from '@nestjs/common';
import { UsersService }    from './UsersService';

@Injectable()
export class UsersMessageBus {

    public constructor(private readonly usersService: UsersService) {

    }

    @RabbitRPC({

        exchange: process.env.RABBITMQ_EXCHANGE,
        routingKey: 'users',
        queue: 'users'

    })
    public async handleMessage(methodCall: MessagingMethod) {

        console.log(methodCall);

        if (this.usersService[ methodCall.methodName ]) {

            return this.usersService[ methodCall.methodName ].apply(methodCall.args).catch(e => console.log(e));

        } else {

            return 'method not found';

        }

    }

}
