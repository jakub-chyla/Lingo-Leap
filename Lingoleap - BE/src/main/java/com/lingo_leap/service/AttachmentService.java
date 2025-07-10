package com.lingo_leap.service;

import com.lingo_leap.dto.AttachmentDTO;
import com.lingo_leap.enums.Language;
import com.lingo_leap.model.Attachment;
import com.lingo_leap.repository.AttachmentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;

    @Transactional
    public Attachment saveAttachment(Long wordId, Language language, MultipartFile file) throws Exception {
        var fileName = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            if (fileName.contains("..")) {
                throw new Exception("Filename contains invalid path sequence "
                        + fileName);
            }

            Optional<Attachment> attachmentOptional = attachmentRepository.findByWordIdAndLanguage(wordId, language);
            if (attachmentOptional.isPresent()) {
                Attachment attachment = attachmentOptional.get();
                attachment.setFileName(fileName);
                attachment.setData(file.getBytes());
                return attachmentRepository.save(attachment);
            } else {
                Attachment attachment = new Attachment();
                attachment.setFileName(fileName);
                attachment.setWordId(wordId);
                attachment.setFileType(file.getContentType());
                attachment.setLanguage(language);
                attachment.setData(file.getBytes());
                return attachmentRepository.save(attachment);
            }

        } catch (Exception e) {
            throw new Exception("Could not save File: " + fileName);
        }
    }

    public Attachment getAttachment(Long fileId) throws Exception {
        return attachmentRepository
                .findById(fileId)
                .orElseThrow(
                        () -> new Exception("File not found with Id: " + fileId));
    }

    public Long deleteAttachmentsByWordId(Long id) {
        attachmentRepository.deleteAttachmentsByWordId(id);
        return id;
    }

    @Transactional
    public Long deleteAttachmentsById(Long id) {
        attachmentRepository.deleteById(id);
        return id;
    }

    public List<AttachmentDTO> findAll() {
        return attachmentRepository.findAllWithOutData();

    }

    public AttachmentDTO findByWordIdAndLanguageWithOutData(Long wordId, Language language) {
        return attachmentRepository.findByWordIdAndLanguageWithOutData(wordId, language);
    }
}
