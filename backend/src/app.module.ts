import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'online_kitapevi',
      autoLoadEntities: true, // Entity'leri otomatik bulur
      synchronize: true, // Tabloları veritabanında otomatik oluşturur
    }),
    UsersModule,
    BooksModule,
    OrdersModule,
    AuthModule,
    AdminModule,
  ],
})
export class AppModule {}
