import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrdersService } from '../orders/orders.service';
import * as fs from 'fs';
import * as path from 'path';
import { User, Role } from '../users/entities/user.entity';
import { Book } from '../books/entities/book.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(
    private dataSource: DataSource,
    private ordersService: OrdersService,
  ) {}

  async getStats() {
    return this.ordersService.getRevenueStats();
  }

  async resetDatabase() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Önce ilişkili tabloları temizle
      await queryRunner.manager.query('TRUNCATE TABLE "order_item" RESTART IDENTITY CASCADE');
      await queryRunner.manager.query('TRUNCATE TABLE "order" RESTART IDENTITY CASCADE');
      await queryRunner.manager.query('TRUNCATE TABLE "book" RESTART IDENTITY CASCADE');
      await queryRunner.manager.query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE');

      // Sabit kullanıcıları oluştur (seed.json'da artık kullanıcılar yok)
      const users = [
        { email: 'admin@kitapevi.com', password: 'adminpassword', name: 'Admin Kullanıcı', role: Role.ADMIN },
        { email: 'user@test.com', password: 'userpassword', name: 'Ahmet Yılmaz', role: Role.USER }
      ];

      for (const userData of users) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = queryRunner.manager.create(User, {
          ...userData,
          password: hashedPassword,
        });
        await queryRunner.manager.save(user);
      }

      // seed.json oku (Artık direkt kitap dizisi)
      const seedPath = path.join(process.cwd(), '..', 'seed.json');
      const booksData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

      // Kitapları ekle
      for (const bookData of booksData) {
        const book = queryRunner.manager.create(Book, {
          title: bookData.title,
          author: bookData.author,
          description: bookData.description || bookData.title, // Açıklama yoksa başlığı kullan
          price: bookData.price,
          imageUrl: bookData.coverImage, // seed.json'daki coverImage -> imageUrl
          stock: bookData.stock
        });
        await queryRunner.manager.save(book);
      }

      await queryRunner.commitTransaction();
      return { message: 'Veritabanı başarıyla sıfırlandı ve yeni seed verileri yüklendi.' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
