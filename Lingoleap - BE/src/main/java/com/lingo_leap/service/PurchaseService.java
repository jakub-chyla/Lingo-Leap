package com.lingo_leap.service;

import com.lingo_leap.model.Purchase;
import com.lingo_leap.repository.PurchaseRepository;
import com.stripe.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;

    public Boolean isPremiumByLogin(Long userId) {
        Purchase purchase = purchaseRepository.findLastPurchaseByUserId(userId);
        //TODO test
        LocalDateTime createdPlus7Days = purchase.getCreated().plus(7, ChronoUnit.DAYS);
        if (LocalDate.now().isBefore(createdPlus7Days.toLocalDate())) {
            return true;
        } else {
            return false;
        }
    }

    void buy(Long userId) {
        Purchase purchase = new Purchase();
        purchase.setUserId(userId);
        purchaseRepository.save(purchase);
    }


}