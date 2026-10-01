package com.example.chat.controller;

import com.example.chat.entity.Sms;
import com.example.chat.entity.User;
import com.example.chat.services.SmsService;
import com.example.chat.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sms")
@CrossOrigin(origins = "http://localhost:4200")
public class SmsController {

    @Autowired
    private SmsService smsService;

    @Autowired
    private UserService userService;

    // Endpoint pour envoyer un SMS
    @PostMapping("/send")
    public ResponseEntity<Map<String, String>> sendSms(

            @RequestParam String toPhoneNumber,
            @RequestParam String message, @RequestParam Long userId) {
        try {
            // Retrieve the user by ID
            User sender = userService.getUserById(userId);
            if (sender == null) {
                throw new IllegalArgumentException("Utilisateur non trouvé avec ID : " + userId);
            }


            // Envoyer le SMS via le service
            String smsId = smsService.sendSms(sender, toPhoneNumber, message);

            // Réponse structurée
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "SMS envoyé avec succès");
            response.put("smsId", smsId);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            // Gestion des erreurs de validation
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            // Gestion des autres erreurs
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Erreur lors de l'envoi du SMS : " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Endpoint pour récupérer tous les SMS
    @GetMapping("/all")
    public ResponseEntity<List<Sms>> getAllSms() {
        try {
            List<Sms> smsList = (List<Sms>) smsService.getAllSms();
            return ResponseEntity.ok(smsList);
        } catch (Exception e) {
            // Gestion des erreurs
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Erreur lors de la récupération des SMS : " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    // Endpoint to retrieve SMS messages by userId (sender)
    @GetMapping("/user/{userId}")
    public List<Sms> getSmsByUserId(@PathVariable Long userId) {
        return smsService.getSmsByUserId(userId);
    }



}
