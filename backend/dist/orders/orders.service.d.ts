import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Book } from '../books/entities/book.entity';
import { OrderItemDto } from '../dto/create-order.dto';
export declare class OrdersService {
    private ordersRepository;
    private orderItemsRepository;
    private booksRepository;
    private dataSource;
    constructor(ordersRepository: Repository<Order>, orderItemsRepository: Repository<OrderItem>, booksRepository: Repository<Book>, dataSource: DataSource);
    create(userId: number, items: OrderItemDto[]): Promise<Order>;
    findAll(): Promise<Order[]>;
    getRevenueStats(): Promise<{
        month: string;
        total: any;
    }[]>;
}
