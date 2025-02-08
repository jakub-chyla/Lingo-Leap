package com.lingo_leap.controller;

import com.lingo_leap.model.Word;
import com.lingo_leap.service.WordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/word")
@RequiredArgsConstructor
public class WordController {

    private final WordService wordService;

    @PostMapping()
    public ResponseEntity<Long> adminOnly(@RequestBody Word word) {
        return ResponseEntity.ok(wordService.saveWord(word));
    }
}
