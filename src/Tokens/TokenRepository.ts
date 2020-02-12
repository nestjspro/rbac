import { EntityRepository, Repository } from 'typeorm';
import { Token }                        from './Token';

@EntityRepository(Token)
export class TokenRepository extends Repository<Token> {

}
