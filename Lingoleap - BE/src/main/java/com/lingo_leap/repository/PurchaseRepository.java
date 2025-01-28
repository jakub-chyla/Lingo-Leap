package com.lingo_leap.repository;

import com.lingo_leap.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

    @Query("SELECT p FROM Purchase p WHERE p.userId = :userId")
    List<Purchase> findLastPurchaseByUserId(Long userId);
}