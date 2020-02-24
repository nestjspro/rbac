import { ResourceNotFoundException } from '@nestjs.pro/common/dist/exceptions/ResourceNotFoundException';
import { Random }                    from '@nestjs.pro/common/dist/utilities/Random';
import { Injectable }                from '@nestjs/common';
import { InjectRepository }          from '@nestjs/typeorm';
import { Organization }              from '../Organizations/Organization';
import { User }                      from '../Users/User';
import { Token }                     from './Token';
import { TokenCreate }               from './TokenCreate';
import { TokenRepository }           from './TokenRepository';

@Injectable()
export class TokensService {

    public constructor(@InjectRepository(TokenRepository) private readonly tokenRepository: TokenRepository) {

    }

    public getByToken(token: string): Promise<Token> {

        return new Promise(async (resolve, reject) => {

            const entity = await this.tokenRepository.findOne({

                where: { token },
                relations: [ 'user' ]

            });

            if (entity) {

                resolve(entity);

            } else {

                reject(new ResourceNotFoundException('could not locate token'));

            }

        });

    }

    /**
     * Create a new api token.
     *
     * @param {User} principal
     * @param tokenCreate
     *
     * @return {Promise<Token>}
     */
    public async create(principal: User, tokenCreate: TokenCreate): Promise<Token> {

        const token = new Token();

        token.organization = principal.organization;
        token.user = principal;
        token.token = Random.getRandomCryptoString(100);
        token.name = tokenCreate.name;
        token.description = tokenCreate.description;

        await this.tokenRepository.save(token);

        return this.getByToken(token.token);

    }

    /**
     * Delete an api token by it's id and owning organization.
     *
     * @param {string} id
     * @param {Organization} organization
     *
     * @return {Promise<boolean>}
     */
    public async deleteByIdAndOrganization(id: string, organization: Organization): Promise<boolean> {

        return (await this.tokenRepository.delete({ id, organization })).affected > 0;

    }

    /**
     * Search across all api tokens.
     *
     * @param {Organization} organization
     *
     * @return {Promise<Array<Token>>}
     */
    public search(organization: Organization): Promise<Array<Token>> {

        return this.tokenRepository.find({ where: { organization } });

    }

}
