import { ResourceAlreadyExistsException }    from '@nestjs.pro/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository }                  from '@nestjs/typeorm';
import * as bcrypt                           from 'bcrypt';
import { Organization }                      from '../Organizations/Organization';
import { OrganizationCreate }                from '../Organizations/OrganizationCreate';
import { OrganizationsService }              from '../Organizations/OrganizationsService';
import { User }                              from './User';
import { UserLogin }                         from './UserLogin';
import { UserPassword }                      from './UserPassword';
import { UserRegister }                      from './UserRegister';
import { UserRepository }                    from './UserRepository';
import { UserStatus }                        from './UserStatus';

@Injectable()
export class UsersService {

    public constructor(@InjectRepository(UserRepository) private userRepository: UserRepository,
                       private organizationsService: OrganizationsService) {

    }

    /**
     * Creates a user account only if the email address doesn't exist.
     *
     * @param {User} user
     *
     * @returns {Promise<User>}
     *
     * @throws {ResourceAlreadyExistsException} Throws if email address already exists.
     */
    public async create(user: User): Promise<User> {

        if (await this.getByEmail(user.email)) {

            throw new ResourceAlreadyExistsException('user by this email already exists');

        } else {

            return this.userRepository.save(user);

        }

    }

    /**
     * Returns a user object (typically used for getting a profile via /my).
     *
     * @param {string} id Users UUID.
     *
     * @returns {Promise<User>}
     */
    public getById(id: string): Promise<User> {

        return new Promise(async (resolve, reject) => {

            const result = await this.userRepository.findOne({

                where: [ { id } ]

            });

            if (result) {

                resolve(result);

            } else {

                reject(new UnauthorizedException('could not locate user'));

            }

        });

    }

    /**
     * Retrieve a specific user based on the owning organization.
     *
     * @param {Organization} organization
     * @param id
     *
     * @returns {Promise<Array<User>>}
     */
    public async getByIdAndPrincipalOrganization(organization: Organization, id: string): Promise<User> {

        return this.userRepository.findOne({

            where: [ { id, organization } ]

        });

    }

    /**
     * Retrieve a user object ONLY if the email and password matches.
     *
     * Note: This will take the plaintext password and automatically encrypt it!
     *
     * @param {string} email
     *
     * @returns {Promise<User>}
     */
    public async getByEmail(email: string): Promise<User> {

        return this.userRepository.findOne({

            where: [ { email } ]

        });

    }

    /**
     * User login.
     *
     * @param {UserLogin} userLogin
     *
     * @returns {Promise<void>}
     */
    public async login(userLogin: UserLogin) {

        const user = await this.getByEmail(userLogin.email);

        if (user) {

            if (await bcrypt.compare(userLogin.password, user.password)) {

                return new Promise((resolve, reject) => {

                    resolve(user);

                });

            }

        }

    }

    /**
     * Registers a new user by creating both the organization and user.
     *
     * @param {UserRegister} userRegister
     *
     * @returns {Promise<string>}
     */
    public async register(userRegister: UserRegister): Promise<User> {

        //
        // First create organization so we can later assignToUser it to the
        // user record that we'll created.
        //
        const _organization: OrganizationCreate = new OrganizationCreate();

        _organization.name = `${ userRegister.email }'s team`;

        let organization: Organization = await this.organizationsService.create(_organization);

        //
        // Create user assigning the organization to it.
        //
        const _user: User = new User();

        _user.status = UserStatus.PENDING_CONFIRMATION;
        _user.organization = organization;
        _user.email = userRegister.email;
        _user.password = userRegister.password;
        // _user.confirmToken = Random.getRandomCryptoString(100);

        //
        // Save the _user object to the database.
        //
        const user = await this.create(_user);

        //
        // Send the welcome email with the confirm token.
        //
        // Sendgrid.send(user.email, 'support@ideation.works', 'd-b380c9ca4c2e4cc9973e82bbc91af953', {
        //
        //     subject: 'Confirm your ideation account!',
        //     token: user.confirmToken
        //
        // });

        return user;

    }

    /**
     * Send a password reset email and token.
     *
     * @param {string} email
     *
     * @returns {Promise<boolean>}
     */
    // public async resetSend(email: string): Promise<boolean> {
    //
    //     const user = await this.getByEmail(email);
    //
    //     if (user) {
    //
    //         user.forgotToken = Random.getRandomCryptoString(100);
    //
    //         await this.userRepository.save(user);
    //
    //         Sendgrid.send(user.email, 'support@ideation.works', 'd-1ff9d851587b494ea91c14da82d8f9b4', {
    //
    //             subject: 'Reset your password',
    //             link: user.forgotToken
    //
    //         });
    //
    //         return true;
    //
    //     } else {
    //
    //         throw new ResourceNotFoundException('email does not exist');
    //
    //     }
    //
    // }

    /**
     * Changes password if token matches.
     *
     * @param {string} token
     * @param {string} password
     *
     * @returns {Promise<boolean>}
     */
    // public async resetSubmit(token: string, password: string): Promise<boolean> {
    //
    //     const user = await this.userRepository.findOne({ where: { forgotToken: token } });
    //
    //     if (user) {
    //
    //         user.password = password;
    //
    //         await this.userRepository.save(user);
    //
    //         return true;
    //
    //     } else {
    //
    //         throw new ResourceNotFoundException('could not locate token');
    //
    //     }
    //
    // }

    /**
     * changing users password
     * @param user
     * @param newPassword
     */
    public async changePassword(user: User, newPassword: UserPassword): Promise<User> {

        const userRecord = await this.getByEmail(user.email);

        userRecord.password = newPassword.password;

        return this.userRepository.save(userRecord);

    }

    public async deleteById(id: string): Promise<boolean> {

        return (await this.userRepository.delete({ id })).affected > 0;

    }

}
