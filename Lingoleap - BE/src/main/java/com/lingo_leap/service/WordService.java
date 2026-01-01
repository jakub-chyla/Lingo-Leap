package com.lingo_leap.service;

import com.lingo_leap.dto.AttachmentDTO;
import com.lingo_leap.dto.WordDto;
import com.lingo_leap.enums.Language;
import com.lingo_leap.model.Word;
import com.lingo_leap.repository.WordRepository;
import com.lingo_leap.utils.Mapper;
import com.lingo_leap.utils.RandomUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WordService {

    private final WordRepository wordRepository;

    private final HistoryService historyService;

    private final AttachmentService attachmentService;

    private final ReinforcementService reinforcementService;

    public List<WordDto> getRandomWordsForUser(Long userId, Integer reinforcementRepetitionCount) {
        var findTodayHistoryByUser = historyService.findTodayHistoryByUser(userId);
        var isReinforcement = reinforcementService.handleReinforcement(userId, findTodayHistoryByUser.size(), reinforcementRepetitionCount);

        var englishAttachment = new AttachmentDTO();
        var polishAttachment = new AttachmentDTO();

        List<Word> words;
        List<WordDto> wordDtos;

        if (isReinforcement) {
            Integer randIndex = RandomUtil.getRandomFromRange(0, findTodayHistoryByUser.size());
            var inCorrectWord = wordRepository.findById(findTodayHistoryByUser.get(randIndex));
            words = wordRepository.findRandomWordsForUser();
            words.set(0, inCorrectWord.get());
        } else {
            words = wordRepository.findRandomWordsForUser();
        }

        englishAttachment = attachmentService.findByWordIdAndLanguageWithOutData(words.get(0).getId(), Language.ENGLISH);
        polishAttachment = attachmentService.findByWordIdAndLanguageWithOutData(words.get(0).getId(), Language.POLISH);

        wordDtos = words.stream().map(word -> Mapper.mapWordsNoAttachments(word)).collect(Collectors.toList());
        wordDtos.get(0).setEnglishAttachment(englishAttachment);
        wordDtos.get(0).setPolishAttachment(polishAttachment);

        return wordDtos;
    }

    public Word saveWord(Word word) {
        return wordRepository.save(word);
    }

    public List<WordDto> findAll() {
        var words = wordRepository.findAllByOrderByEnglishAsc();
        var attachments = attachmentService.findAll();

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
