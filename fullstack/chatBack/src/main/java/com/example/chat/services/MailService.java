package com.example.chat.services;


import com.example.chat.entity.User;
import com.example.chat.repositories.MailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MailService {

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @Autowired
    private MailRepository mailRepository;

    @Autowired
    private UserService userService; // Assuming you have a UserService to fetch users from the DB

    public void sendEmail(String senderEmail, String recipientEmail, String subject, String body) throws IOException {
        // Create the SendGrid email
        Email from = new Email(senderEmail);
        Email to = new Email(recipientEmail);
        Content content = new Content("text/plain", body);
        Mail mail = new Mail(from, subject, to, content);

        // Send the email using SendGrid API
        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            System.out.println("Email sent with status: " + response.getStatusCode());

            // After sending, save the email to the database
            saveEmailToDatabase(senderEmail, recipientEmail, subject, body);

        } catch (IOException ex) {
            throw ex;
        }
    }

    private void saveEmailToDatabase(String senderEmail, String recipientEmail, String subject, String body) {
        // Fetch the sender (User) from the database using the email
        User sender = userService.findByEmail(senderEmail);  // Assuming you have this method to find the user by email

        if (sender == null) {
            throw new RuntimeException("Sender with email " + senderEmail + " not found.");
        }

        // Create a Mail entity and set its fields
        com.example.chat.entity.Mail mail = new com.example.chat.entity.Mail();
        mail.setSender(sender);  // Set the sender (this ensures sender_id is not null)
        mail.setRecipientEmail(recipientEmail);
        mail.setSubject(subject);
        mail.setBody(body);
        mail.setSentAt(LocalDateTime.now());  // Set current timestamp as sentAt

        // Save the Mail entity to the database
        mailRepository.save(mail);
        System.out.println("Email saved to database.");
    }
    // Get all emails sent by a user
    public List<com.example.chat.entity.Mail> getMailsByUser(Long userId) {
        return mailRepository.findBySenderUserId(userId); // Fetch all emails sent by a specific user
    }

    // Get email by ID
    public com.example.chat.entity.Mail getMailById(Long mailId) {
        return mailRepository.findById(mailId)
                .orElseThrow(() -> new RuntimeException("Mail not found"));
    }
}