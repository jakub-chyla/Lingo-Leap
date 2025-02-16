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

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WordService {

    private final WordRepository wordRepository;

    private final AttachmentService attachmentService;

    //TODO: refactor
    public List<WordDto> getRandomWords(Language language) {
        List<Word> words = wordRepository.findRandomWords();
        Attachment attachment = attachmentService.findByWordIdAndLanguage(words.get(0).getId(), language);

        List<WordDto> wordsDto = new ArrayList<>();

        for (int i = 1; i <= words.size(); i++){
            WordDto wordDto = new WordDto();
            wordDto.setId(words.get(i-1).getId());
            wordDto.setEnglish(words.get(i-1).getEnglish());
            wordDto.setPolish(words.get(i-1).getPolish());
            if(i == 1){
                    AttachmentDTO attachmentDTO = new AttachmentDTO();
                    attachmentDTO.setId(attachment.getId());
                    attachmentDTO.setFileName(attachment.getFileName());
                    attachmentDTO.setWordId(attachment.getWordId());
                    wordDto.setEnglishAttachment(attachmentDTO);

            }
            wordsDto.add(wordDto);

        }

        return wordsDto;
    }

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
