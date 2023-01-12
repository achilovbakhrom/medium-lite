import {container, inject, singleton} from "tsyringe";
import { JwtService } from "./jwt";
import {DataSource, EntityManager, Repository} from "typeorm";
import { User } from "../entity/User";
import bcrypt from 'bcrypt';
import {UserDto} from "../dto/UserDto";
import {mapUserEntityToDto} from "../mappers/user";

@singleton()
export class UserService {

  private userRepository: Repository<User>
  private manager: EntityManager;

  constructor(
    @inject(JwtService) private jwtService: JwtService,
    @inject(DataSource) datasource: DataSource,
  ) {
    this.userRepository = datasource.getRepository(User);
    this.manager = datasource.manager;
  }

  async signUp(email: string, password: string): Promise<UserDto> {

    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new Error('User is already registered')
    }

    const newUser = this.userRepository.create({
      email,
      password: this.passwordToHash(password)
    })
    return mapUserEntityToDto(await this.userRepository.save(newUser));
  }

  async signIn(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('User is not registered yet!')
    }
    const isValidPassword = this.verifyPassword(password, user.password || '');
    if (!isValidPassword) {
      throw new Error('Not valid username or password')
    }
    return this.jwtService.encode({ id: user.id })
  }

  async getUsers(page: number, size: number): Promise<{ total: number, result: UserDto[] }> {
    const [ result, total ] = await this.userRepository.findAndCount({ take: size, skip: size * page });
    const list: UserDto[] = [];
    for (const user of result) {
      const rating = await this.getRatingForUserId(user.id);
      list.push(mapUserEntityToDto(user, rating))
    }
    return { result: list, total }
  }

  async getRatingForUserId(userId: number): Promise<number> {
    const result: [{ avg: number }] = await this.manager.query('SELECT avg(pr.rating) as avg FROM post  LEFT JOIN post_rating pr on post.id = pr.postId where post.authorId = $1', [userId]);
    if (result[0].avg) {
      return Number(result[0].avg.toFixed(2));
    }
    return 0;
  }

  private passwordToHash(password: string): string {
    return bcrypt.hashSync(password, 10)
  }

  private verifyPassword(password: string, dbPassword: string): boolean {
    return bcrypt.compareSync(password, dbPassword)
  }

}