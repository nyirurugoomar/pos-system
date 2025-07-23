import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-intent')
  async createPaymentIntent(@Body() body: { amount: number, currency?: string }) {
    const paymentIntent = await this.paymentsService.createPaymentIntent(body.amount, body.currency || 'usd');
    return { clientSecret: paymentIntent.client_secret };
  }
}