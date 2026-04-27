import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getStats(): Promise<{
        month: string;
        total: any;
    }[]>;
    resetDatabase(): Promise<{
        message: string;
    }>;
}
