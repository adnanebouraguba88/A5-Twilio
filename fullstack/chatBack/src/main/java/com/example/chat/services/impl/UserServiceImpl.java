package com.example.chat.services.impl;


import com.example.chat.entity.Role;
import com.example.chat.entity.User;
import com.example.chat.entity.UserStatus;
import com.example.chat.repositories.RoleRepository;
import com.example.chat.repositories.UserRepository;
import com.example.chat.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.orElse(null);
    }

    @Override
    public User createUser(User user) {
        // Encode the password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Save the user to the database first (without roles, if necessary)
        User savedUser = userRepository.save(user);

        // Make sure the user roles list is not null
        if (savedUser.getRoles() == null) {
            savedUser.setRoles(new ArrayList<>());
        }

        // Add the role
        addRoleToUser(savedUser.getUsername(), "USER");

        return userRepository.save(savedUser); // Save the user again with the assigned role
    }


    @Override
    public void deleteUser(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.getSentMails().clear();
            user.getSentSms().clear();
            user.getRoles().clear();
            userRepository.save(user); // Mise à jour pour casser les relations
            userRepository.delete(user);
        } else {
            throw new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId);
        }
    }



    @Override
    public User findUserByName(String name) {

        return userRepository.findByUsername(name);
    }


    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public Role addRole(Role role) {
        return roleRepository.save(role);
    }

    @Override
    public User addRoleToUser(String username, String role) {
        User user = userRepository.findByUsername(username);  // This is correct, you're fetching a User
        Role rol = roleRepository.findByName(role);  // This is correct, you're fetching a Role
        if (user == null) {
            throw new RuntimeException("Utilisateur non trouvé avec le nom : " + username);
        }
        if (rol == null) {
            throw new RuntimeException("Permission non trouvée avec le nom : " + role);
        }
        user.getRoles().add(rol);  // Correctly adding a Role to the User's roles list
        return userRepository.save(user);  // Returning the updated User
    }

    @Override
    public User addRoleToUserById(Long userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId));

        Role rol = roleRepository.findByName(role);
        if (rol == null) {
            throw new RuntimeException("Rôle non trouvé : " + role);
        }

        if (!user.getRoles().contains(rol)) {
            user.getRoles().add(rol);
            return userRepository.save(user);
        }
        return user;
    }

    @Override
    public void updateUserStatus(Long userId, UserStatus status) {
        User user = getUserById(userId); // Assume this method fetches the user
        if (user != null) {
            user.setStatus(status);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
        } else {
            throw new IllegalArgumentException("User not found");
        }
    }

    @Override
    public User removeRoleFromUserById(Long userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId));

        Role rol = roleRepository.findByName(role);
        if (rol == null) {
            throw new RuntimeException("Rôle non trouvé : " + role);
        }

        if (user.getRoles().contains(rol)) {
            user.getRoles().remove(rol);
            return userRepository.save(user);
        }
        return user;
    }


}
