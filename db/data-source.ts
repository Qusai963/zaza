import { config } from 'dotenv';
import { Category } from 'src/modules/category/entities/category.entity';
import { Discount } from 'src/modules/discount/entities/discount.entity';
import { Language } from 'src/modules/language/entities/language.entity';
import { Phone } from 'src/modules/phone/entities/phone.entity';
import { ProductUnit } from 'src/modules/product-unit/entities/product-unit.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { Tax } from 'src/modules/tax/entities/tax.entity';
import { TextContent } from 'src/modules/text-content/entities/text-content.entity';
import { Translation } from 'src/modules/translation/entities/translation.entity';
import { Unit } from 'src/modules/unit/entities/unit.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME_DEVELOPMENT,
  entities: [
    User,
    Language,
    TextContent,
    Translation,
    Tax,
    Category,
    Discount,
    Product,
    Phone,
    Unit,
    ProductUnit,
  ],
  synchronize: true,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
//  entities: ['dist/**/*.entity.js'],
