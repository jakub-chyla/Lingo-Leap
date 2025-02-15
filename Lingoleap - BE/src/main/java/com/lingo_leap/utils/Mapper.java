package com.lingo_leap.utils;

import com.lingo_leap.dto.WordDto;
import com.lingo_leap.model.Attachment;
import com.lingo_leap.model.Word;
import lombok.experimental.UtilityClass;

import java.util.List;
import java.util.stream.Collectors;

@UtilityClass
public class Mapper {
    public WordDto mapTraining(Word word, List<Attachment> attachments) {
        WordDto wordDto = new WordDto();
        wordDto.setId(word.getId());
        wordDto.setEnglish(word.getEnglish());
        wordDto.setPolish(word.getPolish());

        List<Attachment> filteredAttachments = attachments.stream()
                .filter(a -> a.getWordId().equals(word.getId()))
                .collect(Collectors.toList());

        if (!filteredAttachments.isEmpty()) {
            wordDto.setEnglishAttachment(filteredAttachments.get(0));
        }
        if (filteredAttachments.size() > 1) {
            wordDto.setPolishAttachment(filteredAttachments.get(1));
        }

        return wordDto;
    }
}
