package com.example.chat.controller;

import com.example.chat.entity.CallEntity;
import com.example.chat.repositories.CallRepository;
import com.example.chat.services.TwilioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/twilio")
@CrossOrigin(origins = "http://localhost:4200")
public class TwilioController {

    private final TwilioService twilioService;
    private final CallRepository callRepository;

    @Autowired
    public TwilioController(TwilioService twilioService, CallRepository callRepository) {
        this.twilioService = twilioService;
        this.callRepository = callRepository;
    }

    @PostMapping("/makeCall")
    public String makeCall(@RequestParam String toPhoneNumber, @RequestParam Long userId) {
        try {
            twilioService.makeCall(toPhoneNumber, userId);
            return "Call initiated successfully to " + toPhoneNumber;
        } catch (Exception e) {
            return "Error making call: " + e.getMessage();
        }
    }

    // API pour récupérer tous les appels stockés en base
    @GetMapping("/calls")
    public List<CallEntity> getAllCalls() {
        return callRepository.findAll();
    }

    // API pour récupérer les appels envoyés par un utilisateur spécifique
    @GetMapping("/calls/user/{userId}")
    public List<CallEntity> getUserCalls(@PathVariable Long userId) {
        return callRepository.findByUserId(userId);
    }
}
