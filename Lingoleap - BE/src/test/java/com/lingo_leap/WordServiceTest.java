package com.lingo_leap;

import com.lingo_leap.dto.AttachmentDTO;
import com.lingo_leap.dto.WordDto;
import com.lingo_leap.model.Word;
import com.lingo_leap.service.WordService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;

class WordServiceTest {

    @InjectMocks
    private WordService wordService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testMapWordsToDto() {

        // Given
        Word word1 = new Word();
        word1.setId(1L);
        word1.setEnglish("Hello");
        word1.setPolish("Cześć");

        Word word2 = new Word();
        word2.setId(2L);
        word2.setEnglish("Goodbye");
        word2.setPolish("Do widzenia");

        List<Word> words = Arrays.asList(word1, word2);

        AttachmentDTO englishAttachment = new AttachmentDTO();
        AttachmentDTO polishAttachment = new AttachmentDTO();

        // When
        List<WordDto> result = wordService.mapWordsToDto(words, englishAttachment, polishAttachment);

        // Then
        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getId());
        assertEquals("Hello", result.get(0).getEnglish());
        assertEquals("Cześć", result.get(0).getPolish());
        assertEquals(englishAttachment, result.get(0).getEnglishAttachment());
        assertEquals(polishAttachment, result.get(0).getPolishAttachment());

        assertEquals(2L, result.get(1).getId());
        assertEquals("Goodbye", result.get(1).getEnglish());
        assertEquals("Do widzenia", result.get(1).getPolish());
        assertEquals(null, result.get(1).getEnglishAttachment());
        assertEquals(null, result.get(1).getPolishAttachment());
    }
}
