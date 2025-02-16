package com.lingo_leap.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AttachmentDTO {
    private Long id;
    private String fileName;
    private Long wordId;
}
