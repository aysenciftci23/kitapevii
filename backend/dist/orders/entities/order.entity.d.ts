import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
export declare class Order {
    id: number;
    user: User;
    total: number;
    createdAt: Date;
    items: OrderItem[];
}
