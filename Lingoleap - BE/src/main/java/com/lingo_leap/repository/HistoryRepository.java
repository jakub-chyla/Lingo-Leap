package com.lingo_leap.repository;

import com.lingo_leap.model.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HistoryRepository extends JpaRepository<History, Long> {

    @Query("SELECT h FROM History h WHERE h.userId = :userId AND h.isCorrect = false")
    List<History> findIncorrectByUserId(@Param("userId") Long userId);

    @Query("SELECT h FROM History h WHERE h.userId = :userId AND h.wordAskedId = :wordId")
    Optional<History> findByUserIdAndWordId(@Param("userId") Long userId, @Param("wordId") Long wordId);

    @Query(value = "SELECT h.word_asked_id FROM histories h WHERE h.user_id = :userId AND h.is_correct = false AND h.created >= NOW() - INTERVAL '1 day' ORDER BY h.created ASC LIMIT :limit", nativeQuery = true)
    List<Long> findByUserIdAndWordIdLastInCorrect(@Param("userId") Long userId, @Param("limit") Integer limit);

    @Query(value = "SELECT COUNT(*) FROM histories h WHERE h.user_id = :userId AND h.is_correct = false AND h.created >= NOW() - INTERVAL '1 day'", nativeQuery = true)
    Integer findCountOfIncorrect(@Param("userId") Long userId);

}
