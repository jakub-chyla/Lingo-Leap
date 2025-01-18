package com.lingo_leap.service;

import com.lingo_leap.model.Purchase;
import com.lingo_leap.repository.PurchaseRepository;
import com.stripe.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;

    void buy(Long userId){
        Purchase purchase = new Purchase();
        purchase.setUserId(userId);
        purchaseRepository.save(purchase);
    }

}
