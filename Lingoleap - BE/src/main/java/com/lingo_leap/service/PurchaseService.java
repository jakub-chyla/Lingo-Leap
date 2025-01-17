package com.lingo_leap.service;

import com.lingo_leap.repository.PurchaseRepository;
import com.stripe.service.ProductService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;



}
