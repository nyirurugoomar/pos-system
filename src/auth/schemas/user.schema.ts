import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true,
})
export class User extends Document {
    @Prop({ required: true, unique: true })
    username: string;
    @Prop({ required: true })
    password: string;
    @Prop({ required: true, unique: true })
    email: string;
    @Prop({ required: true, enum: ['user', 'cashier', 'manager', 'admin'] })
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);