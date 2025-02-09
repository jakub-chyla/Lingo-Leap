package com.lingo_leap.service;

import com.lingo_leap.model.Word;
import com.lingo_leap.repository.WordRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.beans.Transient;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WordService {

    private final WordRepository wordRepository;

    private final AttachmentService attachmentService;

    public Word saveWord(Word word){
        return wordRepository.save(word);
    }
    public List<Word> findAll(){
        return wordRepository.findAll();
    }

    @Transactional
    public Long deleteById(Long id){
        wordRepository.deleteById(id);
        attachmentService.deleteByWordId(id);
        return id;
    }
}
