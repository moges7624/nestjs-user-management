import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcyrpt from 'bcrypt';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repository: Repository<User>,
    private roleSevice: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.repository.findOneBy({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new HttpException(
        `User with email ${createUserDto.email} already exists`,
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await bcyrpt.hash(createUserDto.password, 10);

    const user = this.repository.create({
      email: createUserDto.email,
      password: hashedPassword,
    });

    return await this.repository.save(user);
  }

  async findAll(conditions?: Partial<User>): Promise<User[]> {
    const users = await this.repository.find({
      where: conditions,
    });
    return users;
  }

  findOne(id: number): Promise<User> {
    return this.repository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.roles) {
      const roles = await this.roleSevice.findAllByIds(updateUserDto.roles);

      user.roles = roles;
      delete updateUserDto.roles;
    }

    Object.assign(user, updateUserDto);
    this.repository.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.repository.remove(user);
  }

  async getUserRoles(userId: number): Promise<Role[] | null> {
    const user = await this.repository.findOne({
      where: { id: userId },
      relations: ['roles.permissions'],
    });

    return user.roles;
  }
}
