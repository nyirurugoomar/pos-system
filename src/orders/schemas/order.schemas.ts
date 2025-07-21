import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop([{
    product: { type: Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number
  }])
  items: Array<{ product: Types.ObjectId, quantity: number, price: number }>;

  @Prop()
  status: string;

  @Prop()
  total: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);