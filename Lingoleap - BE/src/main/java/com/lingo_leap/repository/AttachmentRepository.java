package com.lingo_leap.repository;

import com.lingo_leap.dto.AttachmentDTO;
import com.lingo_leap.model.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    @Modifying
    @Query("DELETE FROM Attachment a WHERE a.wordId = :wordId")
    void deleteAttachmentsByWordId(@Param("wordId") Long wordId);

    @Query("SELECT a FROM Attachment a WHERE a.wordId = :wordId")
    List<Attachment> findByWordId(@Param("wordId") Long wordId);

    @Query("SELECT new com.lingo_leap.dto.AttachmentDTO(a.id, a.fileName, a.wordId) FROM Attachment a")
    List<AttachmentDTO> findAllWithOutData();

//    @Query("SELECT a FROM Attachment a WHERE a.wordId IN :wordIds")
//    List<Attachment> findByWordIds(@Param("wordIds") List<Long> wordIds);

}
