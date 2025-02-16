package com.lingo_leap.service;

import com.lingo_leap.dto.ProductRequest;
import com.lingo_leap.dto.StripeResponse;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StripeService {

    private final PurchaseService purchaseService;

    @Value("${stripe.secretKey}")
    private String secretKey;

    @Value("${cors.allowed.origins}")
    private String frontEndPort;

    public StripeResponse checkoutProducts(ProductRequest productRequest) {
        Stripe.apiKey = secretKey;

        SessionCreateParams.LineItem.PriceData.ProductData productData =
                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                        .setName(productRequest.getName())
                        .build();

        // Create new line item with the above product data and associated price
        SessionCreateParams.LineItem.PriceData priceData =
                SessionCreateParams.LineItem.PriceData.builder()
                        .setCurrency(productRequest.getCurrency() != null ? productRequest.getCurrency() : "USD")
                        .setUnitAmount(productRequest.getAmount())
                        .setProductData(productData)
                        .build();

        // Create new line item with the above price data
        SessionCreateParams.LineItem lineItem =
                SessionCreateParams
                        .LineItem.builder()
                        .setQuantity(productRequest.getQuantity())
                        .setPriceData(priceData)
                        .build();

        // Create new session with the line items
        SessionCreateParams params =
                SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.PAYMENT)
                        .setSuccessUrl(frontEndPort + "/main")
                        .setCancelUrl(frontEndPort + "/pricing")
                        .addLineItem(lineItem)
                        .build();

        purchaseService.buy(productRequest.getUserId());

        // Create new session
        Session session = null;
        try {
            session = Session.create(params);
        } catch (StripeException e) {
            //log the error
        }

        return StripeResponse
                .builder()
                .status("SUCCESS")
                .message("Payment session created ")
                .sessionId(session.getId())
                .sessionUrl(session.getUrl())
                .build();
    }

}
