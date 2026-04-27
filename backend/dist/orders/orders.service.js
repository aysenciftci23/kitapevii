"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const book_entity_1 = require("../books/entities/book.entity");
let OrdersService = class OrdersService {
    ordersRepository;
    orderItemsRepository;
    booksRepository;
    dataSource;
    constructor(ordersRepository, orderItemsRepository, booksRepository, dataSource) {
        this.ordersRepository = ordersRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.booksRepository = booksRepository;
        this.dataSource = dataSource;
    }
    async create(userId, items) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let total = 0;
            const orderItems = [];
            for (const item of items) {
                const book = await queryRunner.manager.findOne(book_entity_1.Book, { where: { id: item.bookId } });
                if (!book || book.stock < item.quantity) {
                    throw new common_1.NotFoundException(`Kitap #${item.bookId} stokta yok veya yetersiz.`);
                }
                book.stock -= item.quantity;
                await queryRunner.manager.save(book);
                const orderItem = new order_item_entity_1.OrderItem();
                orderItem.book = book;
                orderItem.quantity = item.quantity;
                orderItem.price = book.price;
                total += book.price * item.quantity;
                orderItems.push(orderItem);
            }
            const order = new order_entity_1.Order();
            order.user = { id: userId };
            order.total = total;
            order.items = orderItems;
            const savedOrder = await queryRunner.manager.save(order);
            await queryRunner.commitTransaction();
            return savedOrder;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(book_entity_1.Book)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], OrdersService);
//# sourceMappingURL=orders.service.js.map