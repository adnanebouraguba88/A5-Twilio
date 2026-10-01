import { MailModels } from "./mail.model";
import { SmsModel } from "./sms.model";

export class UserModel {
    userId?: number;              // Unique identifier for the user
    username?: string;            // Username of the user
    email?: string;               // Email address of the user
    password?: string;            // Password of the user
    profilePictureUrl?: string;   // URL for the profile picture
    roles? : string[];
    status?: UserStatus;          // Current status of the user
    createdAt?: Date;             // Creation timestamp
    updatedAt?: Date;             // Last updated timestamp
    sentMails?:MailModels[];
    sentSms?:SmsModel[];
  }
  export enum UserStatus {
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE',
  }
