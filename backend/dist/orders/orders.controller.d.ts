import { Request } from 'express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
interface RequestWithUser extends Request {
    user: {
        userId: number;
        email: string;
        role: string;
    };
}
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(req: RequestWithUser, createOrderDto: CreateOrderDto): Promise<import("./entities/order.entity").Order>;
    findAll(): Promise<import("./entities/order.entity").Order[]>;
}
export {};
