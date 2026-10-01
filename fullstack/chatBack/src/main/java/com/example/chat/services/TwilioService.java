package com.example.chat.services;

import com.example.chat.entity.CallEntity;
import com.example.chat.repositories.CallRepository;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Call;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.time.LocalDateTime;

@Service
public class TwilioService {

    @Value("${twilio.sid}")
    private String accountSid;

    @Value("${twilio.token}")
    private String authToken;

    @Value("${twilio.number}")
    private String fromPhoneNumber;

    private final CallRepository callRepository;

    public TwilioService(CallRepository callRepository) {
        this.callRepository = callRepository;
    }

    @PostConstruct
    public void init() {
        Twilio.init(accountSid, authToken);
    }

    public Call makeCall(String toPhoneNumber, Long userId) {
        Call call = Call.creator(
                new PhoneNumber(toPhoneNumber),
                new PhoneNumber(fromPhoneNumber),
                URI.create("https://demo.twilio.com/welcome/voice")
        ).create();

        // Sauvegarde de l'appel en base de données avec l'utilisateur associé
        CallEntity savedCall = new CallEntity(
                toPhoneNumber,
                fromPhoneNumber,
                call.getSid(),
                LocalDateTime.now(),
                userId // Ajout de l'ID de l'utilisateur
        );

        callRepository.save(savedCall);

        return call;
    }
}
