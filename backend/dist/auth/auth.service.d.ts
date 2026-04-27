import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(userData: RegisterUserDto): Promise<{
        id: number;
        email: string;
        name: string;
        role: import("../users/entities/user.entity").Role;
        orders: import("../orders/entities/order.entity").Order[];
    }>;
    login(loginData: LoginUserDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            name: string;
            role: import("../users/entities/user.entity").Role;
        };
    }>;
}
