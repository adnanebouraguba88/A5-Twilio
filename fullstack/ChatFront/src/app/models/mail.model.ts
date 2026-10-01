import { UserModel } from "./user.model";

export class MailModels {

    mailId?: number;          // Unique identifier for the mail
    sender?: UserModel;        // ID of the user who sent the mail
    recipientEmail?: string;  // Email of the recipient
    subject?: string;         // Subject of the email
    body?: string;            // Body of the email
    sentAt?: Date;            // Timestamp when the email was sent
}