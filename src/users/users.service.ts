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

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async create(CreateUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.repository.findOneBy({
      email: CreateUserDto.email,
    });

    if (existingUser) {
      throw new HttpException(
        `User with email ${CreateUserDto.email} already exists`,
        HttpStatus.CONFLICT,
      );
    }

    const user = this.repository.create(CreateUserDto);
    return await this.repository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.repository.find();
  }

  findOne(id: number): Promise<User> {
    return this.repository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
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
}
