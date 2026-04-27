"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const orders_service_1 = require("../orders/orders.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const user_entity_1 = require("../users/entities/user.entity");
const book_entity_1 = require("../books/entities/book.entity");
const bcrypt = __importStar(require("bcryptjs"));
let AdminService = class AdminService {
    dataSource;
    ordersService;
    constructor(dataSource, ordersService) {
        this.dataSource = dataSource;
        this.ordersService = ordersService;
    }
    async getStats() {
        return this.ordersService.getRevenueStats();
    }
    async resetDatabase() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.query('TRUNCATE TABLE "order_item" RESTART IDENTITY CASCADE');
            await queryRunner.manager.query('TRUNCATE TABLE "order" RESTART IDENTITY CASCADE');
            await queryRunner.manager.query('TRUNCATE TABLE "book" RESTART IDENTITY CASCADE');
            await queryRunner.manager.query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE');
            const users = [
                { email: 'admin@kitapevi.com', password: 'adminpassword', name: 'Admin Kullanıcı', role: user_entity_1.Role.ADMIN },
                { email: 'user@test.com', password: 'userpassword', name: 'Ahmet Yılmaz', role: user_entity_1.Role.USER }
            ];
            for (const userData of users) {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                const user = queryRunner.manager.create(user_entity_1.User, {
                    ...userData,
                    password: hashedPassword,
                });
                await queryRunner.manager.save(user);
            }
            const seedPath = path.join(process.cwd(), '..', 'seed.json');
            const booksData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
            for (const bookData of booksData) {
                const book = queryRunner.manager.create(book_entity_1.Book, {
                    title: bookData.title,
                    author: bookData.author,
                    description: bookData.description || bookData.title,
                    price: bookData.price,
                    imageUrl: bookData.coverImage,
                    stock: bookData.stock
                });
                await queryRunner.manager.save(book);
            }
            await queryRunner.commitTransaction();
            return { message: 'Veritabanı başarıyla sıfırlandı ve yeni seed verileri yüklendi.' };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        orders_service_1.OrdersService])
], AdminService);
//# sourceMappingURL=admin.service.js.map