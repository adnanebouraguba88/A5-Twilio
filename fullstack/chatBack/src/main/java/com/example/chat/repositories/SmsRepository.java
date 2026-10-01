package com.example.chat.repositories;

import com.example.chat.entity.Sms;
import com.example.chat.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SmsRepository extends JpaRepository<Sms, Long> {
    List<Sms> findBySender(User sender); // Query to find messages by userId (sender)

}
