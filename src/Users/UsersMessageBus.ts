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

        if (this.usersService[ methodCall.methodName ]) {

            if (methodCall.args && methodCall.args.length === 1) {

                return this.usersService[ methodCall.methodName ](methodCall.args[ 0 ]).catch(e => console.log(e));

            } else if (methodCall.args.length === 2) {

                return this.usersService[ methodCall.methodName ](methodCall.args[ 0 ], methodCall.args[ 1 ]).catch(e => console.log(e));

            } else {

                return 'coordinates do not match';

            }

        } else {

            return 'method not found';

        }

    }

}
