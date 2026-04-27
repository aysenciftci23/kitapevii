import { AuthService } from './auth.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
