import { UserModel } from "./user.model";

export class SmsModel {
  id?: number;                    // Unique identifier for the SMS
  recipientPhoneNumber?: string;  // Phone number of the recipient
  message?: string;               // Content of the SMS
  sentAt?: Date;                  // Timestamp when the SMS was sent
  sender?:UserModel;
}
