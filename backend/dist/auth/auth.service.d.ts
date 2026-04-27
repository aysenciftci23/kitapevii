import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(userData: any): Promise<{
        id: number;
        email: string;
        name: string;
        role: import("../users/entities/user.entity").Role;
        orders: import("../orders/entities/order.entity").Order[];
    }>;
    login(loginData: any): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            name: string;
            role: import("../users/entities/user.entity").Role;
        };
    }>;
}
