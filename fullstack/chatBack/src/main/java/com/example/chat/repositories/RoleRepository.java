package com.example.chat.repositories;

import com.example.chat.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String name); // Match the field name in the entity

}
