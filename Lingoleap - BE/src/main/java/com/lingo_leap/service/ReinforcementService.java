package com.lingo_leap.service;

import com.lingo_leap.model.Reinforcement;
import com.lingo_leap.repository.ReinforcementRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReinforcementService {

    private final ReinforcementRepository reinforcementRepository;

    @Transactional
    public boolean handleReinforcement(Long userId, int size, int reinforcementRepetitionCount) {
        if (size >= reinforcementRepetitionCount) {
            addReinforcement(userId);
        } else if (size <= 0) {
            removeIfExistReinforcement(userId);
        }
        return reinforcementRepository.findByUserId(userId).isPresent();
    }

    public void addReinforcement(Long userId) {
        reinforcementRepository.findByUserId(userId)
                .orElseGet(() -> reinforcementRepository.save(new Reinforcement(null, userId)));
    }

    public void removeIfExistReinforcement(Long userId) {
        Optional<Reinforcement> userReinforcementOptional = reinforcementRepository.findByUserId(userId);
        if (userReinforcementOptional.isPresent()) {
            reinforcementRepository.delete(userReinforcementOptional.get());
        }
    }

    public void resetAll() {
        reinforcementRepository.deleteAll();
    }

}
