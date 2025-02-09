package com.lingo_leap.controller;

import com.lingo_leap.model.Word;
import com.lingo_leap.service.WordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/word")
@RequiredArgsConstructor
public class WordController {

    private final WordService wordService;

    @PostMapping()
    public ResponseEntity<Word> saveWord(@RequestBody Word word) {
        return ResponseEntity.ok(wordService.saveWord(word));
    }

    @GetMapping()
    public ResponseEntity<List<Word>> findAll() {
        return ResponseEntity.ok(wordService.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> deleteById(@PathVariable String id) {
        return ResponseEntity.ok(wordService.deleteById(Long.parseLong(id)));
    }
}
