package com.example.chat;

import com.example.chat.entity.Role;
import com.example.chat.entity.User;
import com.example.chat.entity.UserStatus;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.example.chat.services.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

@SpringBootApplication
public class ChatApplication {
	@Autowired
	UserService userService;

	public static void main(String[] args) {
		SpringApplication.run(ChatApplication.class, args);
	}

	@Bean
	BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	//@PostConstruct
	void initial_users() {
		try {
			Role adminRole = new Role(null, "ADMIN");
			Role userRole = new Role(null, "USER");

			userService.addRole(adminRole);
			userService.addRole(userRole);

			User admin = new User(null,"admin","admin@example.com","123",null,null,UserStatus.OFFLINE,LocalDateTime.now(),LocalDateTime.now());

			userService.createUser(admin);
			userService.addRoleToUser(admin.getUsername(),"ADMIN");

		} catch (Exception e) {
			e.printStackTrace(); // Print the error stack trace for debugging
		}
	}


	}


