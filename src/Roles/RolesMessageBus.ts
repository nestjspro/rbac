import { RabbitRPC }       from '@nestjs-plus/rabbitmq';
import { MessagingMethod } from '@nestjs.pro/common/dist/messaging/MessagingMethod';
import { Injectable }      from '@nestjs/common';
import { RolesService }    from './RolesService';

@Injectable()
export class RolesMessageBus {


    public constructor(private readonly rolesService: RolesService) {

    }

    @RabbitRPC({

        exchange: process.env.RABBITMQ_EXCHANGE,
        routingKey: 'roles',
        queue: 'roles'

    })
    public async handleMessage(methodCall: MessagingMethod) {

        return new Promise((resolve, reject) => {

            if (this.rolesService[ methodCall.methodName ]) {

                this.rolesService[ methodCall.methodName ](...methodCall.args).then(v => {

                    resolve(v);

                }).catch(e => {

                    resolve(e);

                });

            } else {

                resolve('method not found');

            }

        });

    }

}
