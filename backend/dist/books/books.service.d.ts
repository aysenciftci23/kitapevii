import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
export declare class BooksService {
    private booksRepository;
    constructor(booksRepository: Repository<Book>);
    findAll(): Promise<Book[]>;
    findOne(id: number): Promise<Book>;
    create(bookData: Partial<Book>): Promise<Book>;
    update(id: number, bookData: Partial<Book>): Promise<Book>;
    remove(id: number): Promise<void>;
}
