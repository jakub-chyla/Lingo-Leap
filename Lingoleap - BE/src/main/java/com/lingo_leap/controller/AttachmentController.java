package com.lingo_leap.controller;

import com.lingo_leap.dto.ResponseData;
import com.lingo_leap.model.Attachment;
import com.lingo_leap.model.Language;
import com.lingo_leap.service.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequiredArgsConstructor
@RequestMapping("/at")
public class AttachmentController {

    private final AttachmentService attachmentService;


    @PostMapping("/upload/{wordId}/{language}")
    public ResponseEntity<Attachment> uploadFile(@PathVariable String wordId, @PathVariable Language language, @RequestParam("file") MultipartFile file) throws Exception {
        return ResponseEntity.ok(attachmentService.saveAttachment(wordId, language, file));
    }

    @GetMapping("/download/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileId) throws Exception {
        Attachment attachment = null;
        attachment = attachmentService.getAttachment(Long.parseLong(fileId));
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(attachment.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + attachment.getFileName()
                                + "\"")
                .body(new ByteArrayResource(attachment.getData()));
    }
}
