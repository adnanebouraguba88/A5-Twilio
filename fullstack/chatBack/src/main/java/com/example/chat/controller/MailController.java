package com.example.chat.controller;


import com.example.chat.entity.Mail;
import com.example.chat.services.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mail")
@CrossOrigin(origins = "http://localhost:4200")
public class MailController {

    @Autowired
    private MailService mailService;

    @PostMapping("/send")
    public ResponseEntity<Map<String, String>> sendMail(
            @RequestParam(value = "senderEmail") String senderEmail,
            @RequestParam(value = "recipientEmail") String recipientEmail,
            @RequestParam(value = "subject") String subject,
            @RequestParam(value = "body") String body) {

        try {
            // Check for missing required parameters
            if (senderEmail == null || recipientEmail == null || subject == null || body == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Error: Missing required parameters."));
            }

            // Call mail service to send the email
            mailService.sendEmail(senderEmail, recipientEmail, subject, body);
            return ResponseEntity.ok(Map.of("message", "Email sent successfully!"));

        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error sending email: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Unexpected error: " + e.getMessage()));
        }
    }

    // Get all emails sent by a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Mail>> getMailsByUser(@PathVariable Long userId) {
        List<Mail> mails = mailService.getMailsByUser(userId);
        return ResponseEntity.ok(mails);
    }

    // Get email by ID
    @GetMapping("/{mailId}")
    public ResponseEntity<Mail> getMailById(@PathVariable Long mailId) {
        try {
            Mail mail = mailService.getMailById(mailId);
            return ResponseEntity.ok(mail);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
