package com.lingo_leap.controller;

import com.lingo_leap.dto.AuthenticationResponseDto;
import com.lingo_leap.model.AuthRequest;
import com.lingo_leap.model.AuthenticationResponse;
import com.lingo_leap.model.User;
import com.lingo_leap.service.AuthenticationService;
import com.lingo_leap.service.EmailSenderService;
import com.lingo_leap.service.PurchaseService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class AuthenticationController {

    private final AuthenticationService authService;

    private final EmailSenderService emailSenderService;


    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody AuthRequest request) {
        emailSenderService.sendEmail(request.getEmail(),
                "Account created",
                "Hi, "+ request.getUsername());
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponseDto> login(@RequestBody User request) {
        AuthenticationResponseDto authResponse = authService.authenticate(request);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/refresh_token")
    public ResponseEntity refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        return authService.refreshToken(request, response);
    }
}
