import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
export declare class BooksService {
    private booksRepository;
    constructor(booksRepository: Repository<Book>);
    findAll(): Promise<Book[]>;
    findOne(id: number): Promise<Book>;
    create(bookData: CreateBookDto): Promise<Book>;
    update(id: number, bookData: UpdateBookDto): Promise<Book>;
    remove(id: number): Promise<void>;
}
