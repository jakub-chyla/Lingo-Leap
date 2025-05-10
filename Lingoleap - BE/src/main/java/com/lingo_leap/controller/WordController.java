package com.lingo_leap.controller;

import com.lingo_leap.dto.WordDto;
import com.lingo_leap.model.Word;
import com.lingo_leap.service.WordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(wordService.saveWord(word));
    }

    @GetMapping
    public ResponseEntity<List<WordDto>> findAll() {
        List<WordDto> words = wordService.findAll();
        return words.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(words);
    }

    @GetMapping("/random")
    public ResponseEntity<List<WordDto>> getRandom() {
        List<WordDto> randomWords = wordService.getRandomWords();
        return randomWords.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(randomWords);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> deleteById(@PathVariable String id) {
        return ResponseEntity.ok(wordService.deleteById(Long.parseLong(id)));
    }
}
