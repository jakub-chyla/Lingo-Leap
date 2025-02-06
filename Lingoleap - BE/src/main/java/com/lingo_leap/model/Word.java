package com.lingo_leap.model;

import jakarta.persistence.*;

@Table(name = "words")
@Entity
public class Word {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String polish;

    private String english;

}
