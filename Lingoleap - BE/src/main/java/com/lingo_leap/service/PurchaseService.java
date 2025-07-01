package com.lingo_leap.service;

import com.lingo_leap.model.Purchase;
import com.lingo_leap.repository.PurchaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;

    //TODO test
    public Boolean isPremiumByLogin(Long userId) {
        List<Purchase> purchases = purchaseRepository.findLastPurchaseByUserId(userId);
        if (purchases.size() == 0) {
            return false;
        }

        Purchase lastPurchase = purchases.get(purchases.size() - 1);
        LocalDateTime expiryDate = lastPurchase.getCreated().plusDays(7);
        return LocalDateTime.now().isBefore(expiryDate);
    }

    public void buy(Long userId) {
        Purchase purchase = new Purchase();
        purchase.setUserId(userId);
        purchaseRepository.save(purchase);
    }

}