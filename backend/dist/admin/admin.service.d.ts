import { DataSource } from 'typeorm';
import { OrdersService } from '../orders/orders.service';
export declare class AdminService {
    private dataSource;
    private ordersService;
    constructor(dataSource: DataSource, ordersService: OrdersService);
    getStats(): Promise<{
        month: string;
        total: any;
    }[]>;
    resetDatabase(): Promise<{
        message: string;
    }>;
}
