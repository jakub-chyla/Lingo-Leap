package com.lingo_leap.controller;

import com.lingo_leap.dto.AttachmentDTO;
import com.lingo_leap.enums.Language;
import com.lingo_leap.model.Attachment;
import com.lingo_leap.service.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/at")
public class AttachmentController {

    private final AttachmentService attachmentService;

    @PostMapping("/upload/{wordId}/{language}")
    public ResponseEntity<Attachment> uploadFile(@PathVariable Long wordId, @PathVariable Language language, @RequestParam("file") MultipartFile file) throws Exception {
        return ResponseEntity.ok(attachmentService.saveAttachment(wordId, language, file));
    }


    @GetMapping("/download-all")
    public ResponseEntity<StreamingResponseBody> downloadAllFiles() {
        StreamingResponseBody responseBody = outputStream -> attachmentService.writeAttachmentsZip(outputStream);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/zip"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"attachments.zip\"")
                .body(responseBody);
    }

    @PostMapping("/sounds/replace")
    public ResponseEntity<List<String>> replaceSoundFiles() throws Exception {
        return ResponseEntity.ok(attachmentService.replaceAttachmentsFromSoundsFolder());
    }

    @PostMapping("/sounds/upload-replace")
    public ResponseEntity<List<String>> replaceUploadedSoundFiles(@RequestParam("files") List<MultipartFile> files) throws Exception {
        return ResponseEntity.ok(attachmentService.replaceSoundFiles(files));
    }

    @GetMapping("/sounds/replace")
    public ResponseEntity<List<String>> replaceSoundFilesFromSoundsFolder() throws Exception {
        return ResponseEntity.ok(attachmentService.replaceAttachmentsFromSoundsFolder());
    }

    @GetMapping("/download/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileId) throws Exception {
        Attachment attachment = null;
        attachment = attachmentService.getAttachment(Long.parseLong(fileId));

        if (attachment == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(attachment.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + attachment.getFileName() + "\"")
                .body(new ByteArrayResource(attachment.getData()));
    }

    @DeleteMapping("/{attachmentId}")
    public ResponseEntity<Long> deleteAttachmentsById(@PathVariable Long attachmentId) throws Exception {
        return ResponseEntity.ok(attachmentService.deleteAttachmentsById(attachmentId));
    }

    @PatchMapping("/replace-polish-letters")
    public ResponseEntity<Integer> replacePolishLettersInAttachmentFileNames() {
        return ResponseEntity.ok(attachmentService.replacePolishLettersInAttachmentFileNames());
    }

    @PatchMapping("/trim-last-second")
    public ResponseEntity<Integer> trimLastSecondFromAllAttachments() throws Exception {
        return ResponseEntity.ok(attachmentService.trimLastSecondFromAllAttachments());
    }
}
