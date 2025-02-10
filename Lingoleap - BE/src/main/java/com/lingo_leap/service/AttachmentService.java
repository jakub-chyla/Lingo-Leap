package com.lingo_leap.service;

import com.lingo_leap.model.Attachment;
import com.lingo_leap.model.Language;
import com.lingo_leap.repository.AttachmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;

    public Attachment saveAttachment(String wordId, Language language, MultipartFile file) throws Exception {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            if(fileName.contains("..")) {
                throw  new Exception("Filename contains invalid path sequence "
                        + fileName);
            }

            Attachment attachment
                    = new Attachment(fileName,
                    Long.parseLong(wordId),
                    file.getContentType(),
                    language,
                    file.getBytes());
            attachmentRepository.save(attachment);
            return attachment;

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

    public Long deleteByWordId(Long id){
        attachmentRepository.deleteByWordId(id);
        return id;
    }
}
