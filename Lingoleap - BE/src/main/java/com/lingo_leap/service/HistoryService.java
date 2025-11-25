package com.lingo_leap.service;

import com.lingo_leap.dto.Answer;
import com.lingo_leap.model.History;
import com.lingo_leap.repository.HistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final HistoryRepository historyRepository;

    public Integer saveAnswer(Answer answer) {
        var history = historyRepository.findByUserIdAndWordId(answer.userId(), answer.wordId())
                .orElse(new History());

        history.setUserId(answer.userId());
        history.setWordAskedId(answer.wordId());
        history.setIsCorrect(answer.isCorrect());
        historyRepository.save(history);
        return findCountOfIncorrect(answer.userId());
    }

    public Integer findCountOfIncorrect(Long userId){
        Integer count = historyRepository.findCountOfIncorrect(userId);
        return historyRepository.findCountOfIncorrect(userId);
    }

    public List<Long> findByUserIdAndWordIdLastInCorrect(Long userId, Integer limit){
        return historyRepository.findByUserIdAndWordIdLastInCorrect(userId, limit);
    }
}
