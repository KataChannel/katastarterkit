import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { RegisterUserInput, UpdateUserInput, AdminCreateUserInput } from '../graphql/inputs/user.input';
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findByEmailOrUsername(emailOrUsername: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    create(input: RegisterUserInput): Promise<User>;
    update(id: string, input: UpdateUserInput): Promise<User>;
    delete(id: string): Promise<void>;
    verifyPassword(user: User, password: string): Promise<boolean>;
    searchUsers(searchInput: any): Promise<any>;
    getUserStats(): Promise<any>;
    bulkUserAction(actionInput: any): Promise<any>;
    adminUpdateUser(id: string, input: any): Promise<User>;
    adminCreateUser(input: AdminCreateUserInput): Promise<User>;
}
