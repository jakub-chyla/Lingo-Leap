package com.lingo_leap.service;

import com.lingo_leap.model.Attachment;
import com.lingo_leap.repository.AttachmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AttachmentService {

    private AttachmentRepository attachmentRepository;

    public AttachmentService(AttachmentRepository attachmentRepository) {
        this.attachmentRepository = attachmentRepository;
    }

    public Boolean saveAttachment(MultipartFile file) throws Exception {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            if(fileName.contains("..")) {
                throw  new Exception("Filename contains invalid path sequence "
                        + fileName);
            }

            Attachment attachment
                    = new Attachment(fileName,
                    file.getContentType(),
                    file.getBytes());
            attachmentRepository.save(attachment);
            return true;

        } catch (Exception e) {
            throw new Exception("Could not save File: " + fileName);
        }
    }

    public Attachment getAttachment(String fileId) throws Exception {
        return attachmentRepository
                .findById(fileId)
                .orElseThrow(
                        () -> new Exception("File not found with Id: " + fileId));
    }
}
