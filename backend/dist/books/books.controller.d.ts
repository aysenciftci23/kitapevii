import { BooksService } from './books.service';
export declare class BooksController {
    private readonly booksService;
    constructor(booksService: BooksService);
    findAll(): Promise<import("./entities/book.entity").Book[]>;
    findOne(id: string): Promise<import("./entities/book.entity").Book>;
    create(bookData: any): Promise<import("./entities/book.entity").Book>;
    update(id: string, bookData: any): Promise<import("./entities/book.entity").Book>;
    remove(id: string): Promise<void>;
}
