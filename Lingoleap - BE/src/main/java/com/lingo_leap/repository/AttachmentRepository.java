package com.lingo_leap.repository;

import com.lingo_leap.model.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, String> {

    @Modifying
    @Query("DELETE FROM Attachment a WHERE a.wordId = :wordId")
    void deleteByWordId(@Param("wordId") Long wordId);

}
