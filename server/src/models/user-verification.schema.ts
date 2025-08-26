import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class UserVerification {

    @Prop({required: true, unique: true})
    email: string;

    @Prop()
    token: string;
}

export const UserVerificationSchema = SchemaFactory.createForClass(UserVerification);
