import { DatabaseModule } from './database/database.module';
import { ProductModules } from './product/product.module';
import { AuthModule } from './auth/auth.module';

export const modules = [DatabaseModule, AuthModule,ProductModules]