package com.example.chat.controller;

import com.example.chat.entity.User;
import com.example.chat.entity.UserStatus;
import com.example.chat.services.MailService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import com.example.chat.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Contrôleur REST pour gérer les utilisateurs.
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;


    @Value("${file.upload-dir}")
    private String uploadDir;
    /**
     * Récupère tous les utilisateurs.
     *
     * @return une liste de tous les utilisateurs
     */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    /**
     * Récupère un utilisateur par son identifiant.
     *
     * @param userId l'identifiant de l'utilisateur à récupérer
     * @return l'utilisateur trouvé ou une réponse 404 si non trouvé
     */
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        return user != null ? new ResponseEntity<>(user, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    /**
     * Crée un nouvel utilisateur.
     *
     * @param user les détails de l'utilisateur à créer
     * @return l'utilisateur créé
     */
    @PostMapping
    public ResponseEntity<User> createUser(
            @RequestPart("user") User user,
            @RequestPart("file") MultipartFile file) {
        try {
            // Save uploaded image
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);
            Files.createDirectories(filePath.getParent());
            Files.copy(file.getInputStream(), filePath);

            // Set profile picture URL in user object
            user.setProfilePictureUrl(fileName);
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());

            // Save user to database
            User createdUser = userService.createUser(user);

            return ResponseEntity.ok(createdUser);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Met à jour un utilisateur existant.
     *
     * @param userId les détails de l'utilisateur à mettre à jour
     * @param userDetails les nouveaux détails de l'utilisateur
     * @return l'utilisateur mis à jour ou une réponse 404 si non trouvé
     */


    /**
     * Supprime un utilisateur par son identifiant.
     *
     * @param userId l'identifiant de l'utilisateur à supprimer
     * @return une réponse 204 si l'opération est réussie
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Récupère un utilisateur par son email.
     *
     * @param email l'email de l'utilisateur à récupérer
     * @return l'utilisateur trouvé ou une réponse 404 si non trouvé
     */
    @GetMapping("/email")
    public ResponseEntity<User> findByEmail(@RequestParam String email) {
        User user = userService.findByEmail(email);
        return user != null ? new ResponseEntity<>(user, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    /**
     * Serve the profile image.
     * @param fileName the name of the image file to serve
     * @return ResponseEntity with the image file as resource
     */
    @GetMapping("/profile-image/{fileName}")
    public ResponseEntity<Resource> serveProfileImage(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(fileName);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok().body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Updates the status of a user.
     *
     * @param userId the ID of the user
     * @param status the new status
     * @return a response indicating success or failure
     */
    @PutMapping("/{userId}/status")
    public ResponseEntity<Void> updateUserStatus(@PathVariable Long userId, @RequestParam String status) {
        try {
            userService.updateUserStatus(userId, UserStatus.valueOf(status));
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // Invalid status value
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{userId}/role")
    public ResponseEntity<User> addRoleToUser(@PathVariable Long userId, @RequestBody String role) {
        User updatedUser = userService.addRoleToUserById(userId, role);
        return ResponseEntity.ok(updatedUser);
    }


    @PostMapping("/{userId}/roles")
    public ResponseEntity<User> updateUserRole(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        try {
            String role = request.get("role");
            String action = request.get("action");
            if (role == null || action == null) {
                return ResponseEntity.badRequest().body(null);
            }

            User updatedUser;
            if ("add".equals(action)) {
                updatedUser = userService.addRoleToUserById(userId, role);
            } else if ("remove".equals(action)) {
                updatedUser = userService.removeRoleFromUserById(userId, role);
            } else {
                return ResponseEntity.badRequest().body(null);
            }

            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }



}
