import { OrderItem } from '../../orders/entities/order-item.entity';
export declare class Book {
    id: number;
    title: string;
    author: string;
    description: string;
    price: number;
    imageUrl: string;
    stock: number;
    orderItems: OrderItem[];
}
