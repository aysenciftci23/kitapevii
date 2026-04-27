import { Order } from './order.entity';
import { Book } from '../../books/entities/book.entity';
export declare class OrderItem {
    id: number;
    order: Order;
    book: Book;
    quantity: number;
    price: number;
}
