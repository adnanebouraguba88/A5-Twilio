package com.example.chat.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Représente un rôle utilisateur dans le système.
 */
@Entity
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roleId; // Identifiant unique pour chaque rôle

    @Column(unique = true)
    private String name; // Exemple : "USER", "ADMIN"

    // Constructeur par défaut
    public Role() {}

    // Constructeur avec les champs
    public Role(Long roleId, String name) {
        this.roleId = roleId;
        this.name = name;
    }

    // Getters et Setters
    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}