package com.lingo_leap.service;

import com.lingo_leap.dto.WordDto;
import com.lingo_leap.model.Attachment;
import com.lingo_leap.model.Word;
import com.lingo_leap.repository.WordRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WordService {

    private final WordRepository wordRepository;

    private final AttachmentService attachmentService;

    public Word saveWord(Word word){
        return wordRepository.save(word);
    }
    public List<WordDto> findAll(){
        List<Word> words = wordRepository.findAll();
        List<Attachment> attachments = attachmentService.findAll();
        //refactor map
        List<WordDto> wordDtos = new ArrayList<>();

        for(Word word : words){
            WordDto dto = new WordDto();
            dto.setId(word.getId());
            dto.setEnglish(word.getEnglish());
            dto.setPolish(word.getPolish());

            List<Attachment> filteredAttachments = attachments.stream().filter(a -> a.getWordId().equals(word.getId())).collect(Collectors.toList());
            if(filteredAttachments.size() > 0){
                dto.setEnglishAttachment(attachments.stream().filter(a -> a.getWordId().equals(word.getId())).collect(Collectors.toList()).get(0));
            }
            if(filteredAttachments.size() > 1){
                dto.setPolishAttachment(attachments.stream().filter(a -> a.getWordId().equals(word.getId())).collect(Collectors.toList()).get(1));
            }
            wordDtos.add(dto);
        }

        return wordDtos;
    }

    @Transactional
    public Long deleteById(Long id){
        wordRepository.deleteById(id);
        attachmentService.deleteAttachmentsByWordId(id);
        return id;
    }
}
