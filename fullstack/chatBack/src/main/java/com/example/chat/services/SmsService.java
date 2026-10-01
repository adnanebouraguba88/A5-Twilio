package com.example.chat.services;

import com.example.chat.entity.Sms;
import com.example.chat.entity.User;
import com.example.chat.repositories.SmsRepository;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SmsService {

    private static final Logger logger = LoggerFactory.getLogger(SmsService.class);

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String fromPhoneNumber;

    @Autowired
    private SmsRepository smsRepository;

    public String sendSms(User sender, String toPhoneNumber, String messageContent) {
        // Validation du numéro de téléphone
        if (!toPhoneNumber.matches("\\+?[1-9]\\d{1,14}")) {
            logger.error("Numéro de téléphone invalide : {}", toPhoneNumber);
            throw new IllegalArgumentException("Numéro de téléphone invalide : " + toPhoneNumber);
        }

        try {
            // Initialisation de Twilio
            Twilio.init(accountSid, authToken);

            // Envoi du SMS avec Twilio
            Message message = Message.creator(
                    new com.twilio.type.PhoneNumber(toPhoneNumber),
                    new com.twilio.type.PhoneNumber(fromPhoneNumber),
                    messageContent
            ).create();

            logger.info("SMS envoyé avec succès à {} avec SID {}", toPhoneNumber, message.getSid());

            // Sauvegarde du SMS dans la base de données
            Sms sms = new Sms(toPhoneNumber, messageContent, LocalDateTime.now(), sender);
            smsRepository.save(sms);

            return message.getSid();
        } catch (Exception e) {
            logger.error("Erreur lors de l'envoi du SMS : {}", e.getMessage());
            throw new RuntimeException("Échec de l'envoi du SMS : " + e.getMessage());
        }
    }

    // Méthode pour récupérer tous les SMS
    public Iterable<Sms> getAllSms() {
        return smsRepository.findAll();
    }

    // Méthode pour récupérer les SMS par userId (sender)
    public List<Sms> getSmsByUserId(Long userId) {
        User sender = new User(); // Assuming User class has a constructor that can be initialized with ID
        sender.setUserId(userId); // Set the userId for filtering
        return smsRepository.findBySender(sender); // Retrieve messages for the specific user
    }


}
