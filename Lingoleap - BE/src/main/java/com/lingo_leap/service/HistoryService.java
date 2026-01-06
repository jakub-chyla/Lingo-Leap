package com.lingo_leap.service;

import com.lingo_leap.dto.Answer;
import com.lingo_leap.model.History;
import com.lingo_leap.repository.HistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.LinkedHashMap;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final HistoryRepository historyRepository;
    private final ReinforcementService reinforcementService;

    public Integer saveAnswer(Answer answer) {
        var history = new History();
        history.setUserId(answer.userId());
        history.setWordAskedId(answer.wordId());
        history.setIsCorrect(answer.isCorrect());
        boolean reinforcement = reinforcementService.isReinforcement(answer.userId());
        boolean correct = answer.isCorrect();
        if (reinforcement && correct) {
            historyRepository.save(history);
        }

        if (!reinforcement) {
            historyRepository.save(history);
        }

        return findHistoryByUser(answer.userId()).size();
    }

    public Integer findCountOfIncorrect(Long userId) {
        return findHistoryByUser(userId).size();
    }

    public List<Long> findByUserIdAndWordIdLastInCorrect(Long userId, Integer limit) {
        return historyRepository.findByUserIdAndWordIdLastInCorrect(userId, limit);
    }

    public List<Long> findHistoryByUser(Long userId) {
        return findHistoryByUser(historyRepository.findTodayHistoryByUser(userId));
    }

    public List<Long> findHistoryByUser(List<History> histories) {
        if (histories.size() < 1) {
            return new ArrayList<>();
        }

        Map<Long, List<History>> map = new HashMap<>();

        for (History history : histories) {
            Long key = history.getWordAskedId();

            List<History> list = map.get(key);
            if (list == null) {
                list = new ArrayList<>();
                map.put(key, list);
            }

            list.add(history);
        }

        List<Long> ids = new ArrayList<>();

        for (Map.Entry<Long, List<History>> entry : map.entrySet()) {
            List<History> value = entry.getValue();
            History history = value.get(0);
            if (!history.getIsCorrect()) {
                ids.add(history.getWordAskedId());
            }
        }

        return ids;
    }

    public List<History> findAllHistoryByUser(Long userId) {
    return historyRepository.findAllHistoryByUser(userId);
    }

    public Long findMostCommonWrongHistoryByUser(Long userId) {
        List<History> allHistories = historyRepository.findAllHistoryByUser(userId);

        Map<Long, List<History>> map = new HashMap<>();

        for (History history : allHistories) {
            Long key = history.getWordAskedId();

            List<History> list = map.get(key);
            if (list == null) {
                list = new ArrayList<>();
                map.put(key, list);
            }

            list.add(history);
        }

        Map<Long, Double> correctRatio = new HashMap<>();

        for (Map.Entry<Long, List<History>> entry : map.entrySet()) {
            List<History> histories = entry.getValue();
            List<History> wrong = histories.stream().filter(h -> h.getIsCorrect().equals(false)).collect(Collectors.toList());
            Double ratio = wrong.size() / (double) histories.size();
            correctRatio.put(entry.getKey(), ratio);
        }

        return correctRatio.entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(0L);
    }

    public List<Long> findLatestDistinctWordAskedIds(Long userId) {
        return historyRepository.findLatestDistinctWordAskedIds(userId);
    }
}
