import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: any, @Body() body: { items: { bookId: number; quantity: number }[] }) {
    return this.ordersService.create(req.user.userId, body.items);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }
}
