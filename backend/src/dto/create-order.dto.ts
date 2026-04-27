export class CreateOrderDto {
  items: OrderItemDto[];
}

export class OrderItemDto {
  bookId: number;
  quantity: number;
}
