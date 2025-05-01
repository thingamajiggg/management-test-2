import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsOrder } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findAll(filterDto: FilterUserDto) {
    const { search, sortBy, sortOrder, page = 1, pageSize = 10 } = filterDto;
    
    // Build where condition
    const whereCondition = {};
    if (search) {
      whereCondition['fullName'] = Like(`%${search}%`);
    }

    // Build order condition
    const orderCondition: FindOptionsOrder<User> = {};
    if (sortBy) {
      orderCondition[sortBy] = sortOrder || 'ASC';
    } else {
      orderCondition['id'] = 'DESC';
    }

    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Execute query with pagination
    const [users, total] = await this.usersRepository.findAndCount({
      where: whereCondition,
      order: orderCondition,
      take: pageSize,
      skip,
    });

    // Calculate total pages
    const totalPages = Math.ceil(total / pageSize);

    return {
      data: users.map(user => {
        const { password, ...result } = user;
        return result;
      }),
      meta: {
        page,
        pageSize,
        totalItems: total,
        totalPages,
      },
    };
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { password, ...result } = user;
    return result as User;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Check if user exists
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if email is being updated and if it already exists
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    // Hash the password if it's being updated
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.usersRepository.update(id, updateUserDto);
    
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}