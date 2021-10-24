import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp({ username, password }: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser({ username, password });
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ message: string; token: string }> {
    const { username, password } = authCredentialsDto;

    const user = await this.usersRepository.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('Please check your login credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Please check your login credentials');
    }

    const token = this.jwtService.sign({ username });

    return { message: 'Authenticated in successfully.', token };
  }
}
