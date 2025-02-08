package com.lingo_leap.service;

import com.lingo_leap.model.Word;
import com.lingo_leap.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WordService {

    private final WordRepository wordRepository;

    public Long saveWord(Word word){
        return wordRepository.save(word).getId();
    }
}
