package com.example.chat.repositories;

import com.example.chat.entity.CallEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CallRepository extends JpaRepository<CallEntity, Long> {
    List<CallEntity> findByUserId(Long userId);}
