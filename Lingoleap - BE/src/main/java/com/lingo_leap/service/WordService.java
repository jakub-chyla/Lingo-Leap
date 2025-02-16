package com.lingo_leap.service;

import com.lingo_leap.dto.AttachmentDTO;
import com.lingo_leap.dto.WordDto;
import com.lingo_leap.model.Attachment;
import com.lingo_leap.model.Language;
import com.lingo_leap.model.Word;
import com.lingo_leap.repository.WordRepository;
import com.lingo_leap.utils.Mapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WordService {

    private final WordRepository wordRepository;

    private final AttachmentService attachmentService;

//    public List<WordDto> getRandomWords(Language language) {
//        List<Word> words = wordRepository.findRandomWords();
//        List<Attachment> attachments = attachmentService.findByWordId(words.get(0).getId());
//        return words.stream()
//                .map(word -> Mapper.mapWordWithAttachmentsName(word, attachments))
//                .collect(Collectors.toList());
//    }

    public Word saveWord(Word word) {
        return wordRepository.save(word);
    }

    public List<WordDto> findAll() {
        List<Word> words = wordRepository.findAll();
        List<AttachmentDTO> attachments = attachmentService.findAll();

        return words.stream()
                .map(word -> Mapper.mapWordWithAttachmentsName(word, attachments))
                .collect(Collectors.toList());
    }

    @Transactional
    public Long deleteById(Long id) {
        wordRepository.deleteById(id);
        attachmentService.deleteAttachmentsByWordId(id);
        return id;
    }
}
