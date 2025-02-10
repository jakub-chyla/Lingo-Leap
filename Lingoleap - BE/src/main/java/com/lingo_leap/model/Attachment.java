package com.lingo_leap.model;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Getter
@Setter
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

    @Enumerated(value = EnumType.STRING)
    private Language language;

    @Lob
    private byte[] data;

}
