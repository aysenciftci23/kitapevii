import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Book } from '../books/entities/book.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    private dataSource: DataSource,
  ) {}

  async create(userId: number, items: { bookId: number; quantity: number }[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let total = 0;
      const orderItems: OrderItem[] = [];

      for (const item of items) {
        const book = await queryRunner.manager.findOne(Book, { where: { id: item.bookId } });
        if (!book || book.stock < item.quantity) {
          throw new NotFoundException(`Kitap #${item.bookId} stokta yok veya yetersiz.`);
        }

        // Stok güncelle
        book.stock -= item.quantity;
        await queryRunner.manager.save(book);

        const orderItem = new OrderItem();
        orderItem.book = book;
        orderItem.quantity = item.quantity;
        orderItem.price = book.price;
        total += book.price * item.quantity;
        orderItems.push(orderItem);
      }

      const order = new Order();
      order.user = { id: userId } as any;
      order.total = total;
      order.items = orderItems;

      const savedOrder = await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return this.ordersRepository.find({
      relations: ['user', 'items', 'items.book'],
      order: { createdAt: 'DESC' },
    });
  }

  async getRevenueStats() {
    const orders = await this.ordersRepository.find();
    
    // Yılın tüm aylarını içeren bir nesne oluştur (0 ile başlat)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const stats = {};
    months.forEach(m => stats[m] = 0);

    orders.forEach((order) => {
      const monthIndex = new Date(order.createdAt).getMonth();
      const monthName = months[monthIndex];
      stats[monthName] += order.total;
    });

    return months.map(month => ({
      month,
      total: stats[month]
    }));
  }
}
