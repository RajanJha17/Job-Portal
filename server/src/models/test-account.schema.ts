import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type TestAccountsDocument = TestAccounts & Document;

@Schema({ timestamps: true })
export class TestAccounts {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  expire_date: Date;
}

export const TestAccountsSchema = SchemaFactory.createForClass(TestAccounts);
