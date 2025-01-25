package com.lingo_leap.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OpenController {

    @GetMapping("/open")
    public ResponseEntity<String> demo() {
        return ResponseEntity.ok("Hello from open url");
    }


}
