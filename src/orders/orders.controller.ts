import { Body, Controller, Post,Get,Put,Param, UseGuards,Delete } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto/orders';
import { OrdersService } from './orders.service';
import { Order } from './schemas/order.schemas';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/user.decorator';


@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}
    @UseGuards(JwtAuthGuard)
    @Post()
    async createOrder(
        @CurrentUser() user: any,
        @Body() createOrderDto: CreateOrderDto
      ) {
        
        return this.ordersService.createOrder({
          ...createOrderDto,
          user: user._id, 

        });
      }

    @Get()
    async getOrders(): Promise<Order[]> {
        return this.ordersService.getOrders();
    }
    @Get(':id')
    async getOrderById(@Param('id') id: string): Promise<Order> {
        return this.ordersService.getOrderById(id);
    }

    @Put(':id')
    async updateOrder(@Param('id') id: string, @Body() order: UpdateOrderDto): Promise<Order> {
        return this.ordersService.updateOrder(id, order);
    }

    @Delete(':id')
   async deleteOrder(@Param('id') id: string) {
  const order = await this.ordersService.deleteOrder(id);
  return {
    message: 'Order deleted successfully',
    order,
  };
}
}
