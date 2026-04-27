import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
