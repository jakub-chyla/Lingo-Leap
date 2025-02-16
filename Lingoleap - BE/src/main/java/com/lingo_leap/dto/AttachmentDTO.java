package com.lingo_leap.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class AttachmentDTO {
    private Long id;
    private String fileName;
    private Long wordId;
}
