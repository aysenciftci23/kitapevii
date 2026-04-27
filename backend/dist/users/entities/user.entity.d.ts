import { Order } from '../../orders/entities/order.entity';
export declare enum Role {
    USER = "USER",
    ADMIN = "ADMIN"
}
export declare class User {
    id: number;
    email: string;
    password: string;
    name: string;
    role: Role;
    orders: Order[];
}
