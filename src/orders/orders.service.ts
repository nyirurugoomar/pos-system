import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schemas';
import { CreateOrderDto, UpdateOrderDto } from './dto/orders';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<Order>,
    ) {}


    async createOrder(order: CreateOrderDto): Promise<Order> {
        const createdOrder = new this.orderModel(order);
        return createdOrder.save();
    }

    async getOrders(): Promise<Order[]> {
        return this.orderModel.find()
        .populate('user','username')
        .populate('items.product','name')
        .exec();
    }

    async getOrderById(id: string): Promise<Order> {
        return this.orderModel.findById(id)
        .populate('user','username')
        .populate('items.product','name');
    }

    async updateOrder(id: string, order: UpdateOrderDto): Promise<Order> {
        return this.orderModel.findByIdAndUpdate(id, order, { new: true })
        .populate('user','username')
        .populate('items.product','name')
        .exec();
    }

    async deleteOrder(id: string): Promise<{message: string;order: Order | null}> {
        const deletedOrder = await this.orderModel.findByIdAndDelete(id)
        .populate('user','username')
        .populate('items.product','name')
        .exec();

        if(!deletedOrder){
            return {
                message: 'Order not found',
                order: null
            }
        }
        return {
            message: 'Order deleted successfully',
            order: deletedOrder
        }
    }
    
    
}
