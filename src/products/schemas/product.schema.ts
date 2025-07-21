import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; 
import { Document, Types } from 'mongoose';

@Schema({
    timestamps: true,
})
export class Product extends Document {


    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    image: string;

    @Prop({ default: 0 })
    stock: number;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: Types.ObjectId, ref: 'Category' })
    category: Types.ObjectId;


    
   
    
    
}

export const ProductSchema = SchemaFactory.createForClass(Product);