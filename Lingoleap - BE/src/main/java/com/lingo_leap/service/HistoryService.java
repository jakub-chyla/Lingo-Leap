package com.lingo_leap.service;

import com.lingo_leap.dto.Answer;
import com.lingo_leap.model.History;
import com.lingo_leap.repository.HistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

        return findTodayHistoryByUser(answer.userId()).size();
    }

    public Integer findCountOfIncorrect(Long userId){
        return historyRepository.findCountOfIncorrect(userId);
    }

    public List<Long> findByUserIdAndWordIdLastInCorrect(Long userId, Integer limit){
        return historyRepository.findByUserIdAndWordIdLastInCorrect(userId, limit);
    }

    public List<Long> findTodayHistoryByUser(Long userId) {
        var todayHistory = historyRepository.findTodayHistoryByUser(userId);
        if(todayHistory.size() < 1){
            return new ArrayList<>();
        }

        Map<Long, List<History>> map = new HashMap<>();

        for (History history : todayHistory) {
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

    public List<Long> findLatestDistinctWordAskedIds(Long userId) {
        return historyRepository.findLatestDistinctWordAskedIds(userId);
    }
}
