package com.lingo_leap.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;


@Entity
@Getter
@Setter
@RequiredArgsConstructor
@Table(name = "attachments")
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_name")
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
