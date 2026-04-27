export class CreateBookDto {
  title: string;
  author: string;
  description?: string;
  price: number;
  imageUrl: string;
  stock: number;
}
