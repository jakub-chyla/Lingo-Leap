package com.lingo_leap.service;

import com.lingo_leap.dto.AttachmentDTO;
import com.lingo_leap.dto.WordDto;
import com.lingo_leap.enums.Language;
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

    public List<WordDto> getRandomWords() {
        List<Word> words = wordRepository.findRandomWords();
        AttachmentDTO englishAttachment = attachmentService.findByWordIdAndLanguageWithOutData(words.get(0).getId(), Language.ENGLISH);
        AttachmentDTO polishAttachment = attachmentService.findByWordIdAndLanguageWithOutData(words.get(0).getId(), Language.POLISH);

        return mapWordsToDto(words, englishAttachment, polishAttachment);
    }

    public List<WordDto> mapWordsToDto(List<Word> words, AttachmentDTO englishAttachment, AttachmentDTO polishAttachment) {
        List<WordDto> wordsDto = new ArrayList<>();

        for (int i = 0; i < words.size(); i++) {
            WordDto wordDto = new WordDto();
            wordDto.setId(words.get(i).getId());
            wordDto.setEnglish(words.get(i).getEnglish());
            wordDto.setPolish(words.get(i).getPolish());

            if (i == 0) {
                wordDto.setEnglishAttachment(englishAttachment);
                wordDto.setPolishAttachment(polishAttachment);
            }

            wordsDto.add(wordDto);
        }
        return wordsDto;
    }

    public Word saveWord(Word word) {
        return wordRepository.save(word);
    }

    public List<WordDto> findAll() {
        List<Word> words = wordRepository.findAllByOrderByEnglishAsc();
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
