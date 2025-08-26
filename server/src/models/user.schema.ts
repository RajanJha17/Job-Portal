import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = User & Document;




@Schema({ timestamps: true })
export class User {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: String, maxlength: 64000, default: null })
    data: string;

    @Prop({ default: true })
    profileVisible: boolean;

    @Prop({ default: false })
    working: boolean;

    @Prop({ default: false })
    active: boolean;

    @Prop({ type: Number, default: 0 })
    lat: number;

    @Prop({ type: Number, default: 0 })
    lng: number;

    @Prop({ default: false })
    blocked: boolean;

    @Prop({ type: Date, default: Date.now }) // register_datetime
    register_datetime: Date;

    @Prop({ type: String, default: null })
    own_cv: string

}

export const UserSchema = SchemaFactory.createForClass(User);

