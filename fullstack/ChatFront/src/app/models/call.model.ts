import { UserModel } from "./user.model";

export interface Call {
  id: number;
  toPhoneNumber: string;
  fromPhoneNumber: string;
  callSid: string;
  callTime: string;
  userId: number; // Ajout du champ userId
}
