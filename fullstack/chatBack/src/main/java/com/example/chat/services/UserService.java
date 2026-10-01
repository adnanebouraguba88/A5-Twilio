package com.example.chat.services;

import com.example.chat.entity.Role;
import com.example.chat.entity.User;
import com.example.chat.entity.UserStatus;

import java.util.List;

public interface UserService  {
    List<User> getAllUsers();
    User getUserById(Long userId);
    User createUser(User user);
    void deleteUser(Long userId);
    User findUserByName(String name);

    User findByEmail(String email);

    Role addRole(Role role);
    User addRoleToUser(String username, String role);
    User addRoleToUserById(Long userId, String role);

    void updateUserStatus(Long userId, UserStatus status);
    public User removeRoleFromUserById(Long userId, String role);
}