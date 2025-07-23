import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/orders/schemas/order.schemas';

@Injectable()
export class ReportsService {
    constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}
    
    async getSalesReport(from: Date, to: Date) {
        return this.orderModel.aggregate([
          { $match: { createdAt: { $gte: from, $lte: to } } },
          { $group: { _id: null, totalSales: { $sum: "$total" }, count: { $sum: 1 } } }
        ]);
      }
}
