package com.lingo_leap.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "attachments")
public class Attachment {

    @Id
    @Column(name = "file_name", nullable = false, unique = true)
    private String fileName;

    @Column(name = "word_id")
    private Long wordId;

    @Column(name = "file_type")
    private String fileType;

    @Lob
    private byte[] data;


}
