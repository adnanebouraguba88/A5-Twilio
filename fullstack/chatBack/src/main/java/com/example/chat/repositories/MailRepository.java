package com.example.chat.repositories;

import com.example.chat.entity.Mail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MailRepository extends JpaRepository<Mail, Long> {

    List<Mail> findBySenderUserId(Long userId); // Fetch mails by user ID

}
