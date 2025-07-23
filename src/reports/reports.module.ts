import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports:[OrdersModule],
  controllers: [ReportsController],
  providers: [ReportsService]
})
export class ReportsModule {}
