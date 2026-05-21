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

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;

    @Transactional
    public Attachment saveAttachment(Long wordId, Language language, MultipartFile file) throws Exception {
        var fileName = replacePolishLetters(StringUtils.cleanPath(file.getOriginalFilename()));

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

    public List<String> replaceSoundFiles(List<MultipartFile> files) throws Exception {
        if (files == null || files.isEmpty()) {
            throw new Exception("No files provided");
        }

        Path soundsDir = Paths.get("sounds");
        List<String> replacedFiles = new ArrayList<>();

        try {
            Files.createDirectories(soundsDir);
            Path soundsDirPath = soundsDir.toAbsolutePath().normalize();

            for (MultipartFile file : files) {
                String originalFileName = file.getOriginalFilename();
                String fileName = replacePolishLetters(StringUtils.cleanPath(originalFileName == null ? "" : originalFileName));

                if (!StringUtils.hasText(fileName)) {
                    throw new Exception("File name is empty");
                }

                if (fileName.contains("..")) {
                    throw new Exception("Filename contains invalid path sequence " + fileName);
                }

                Path targetPath = soundsDir.resolve(fileName).normalize();
                Path targetAbsolutePath = targetPath.toAbsolutePath().normalize();

                if (!targetAbsolutePath.startsWith(soundsDirPath)) {
                    throw new Exception("Filename resolves outside sounds folder " + fileName);
                }

                if (!Files.exists(targetAbsolutePath)) {
                    throw new Exception("Sound file not found: " + fileName);
                }

                try (InputStream inputStream = file.getInputStream()) {
                    Files.copy(inputStream, targetAbsolutePath, StandardCopyOption.REPLACE_EXISTING);
                }
                replacedFiles.add(fileName);
            }

            return replacedFiles;
        } catch (IOException e) {
            throw new Exception("Could not replace sound files", e);
        }
    }

    @Transactional
    public List<String> replaceAttachmentsFromSoundsFolder() throws Exception {
        return replaceAttachmentsFromSoundsFolder(Paths.get("sounds"));
    }

    List<String> replaceAttachmentsFromSoundsFolder(Path soundsDir) throws Exception {
        Path soundsDirPath = soundsDir.toAbsolutePath().normalize();

        if (!Files.isDirectory(soundsDirPath)) {
            throw new Exception("Sounds folder not found: " + soundsDirPath);
        }

        Map<String, Path> soundFilesByName = new HashMap<>();

        try (Stream<Path> paths = Files.list(soundsDirPath)) {
            paths.filter(Files::isRegularFile)
                    .filter(path -> path.getFileName().toString().toLowerCase().endsWith(".mp3"))
                    .forEach(path -> soundFilesByName.put(
                            replacePolishLetters(path.getFileName().toString()),
                            path.toAbsolutePath().normalize()
                    ));
        } catch (IOException e) {
            throw new Exception("Could not read sounds folder", e);
        }

        List<Attachment> changedAttachments = new ArrayList<>();
        List<String> replacedFiles = new ArrayList<>();

        try {
            attachmentRepository.findAll().forEach(attachment -> {
                String normalizedFileName = replacePolishLetters(attachment.getFileName());
                Path soundFile = soundFilesByName.get(normalizedFileName);

                if (soundFile != null) {
                    try {
                        attachment.setFileName(normalizedFileName);
                        attachment.setFileType("audio/mpeg");
                        attachment.setData(Files.readAllBytes(soundFile));
                        changedAttachments.add(attachment);
                        replacedFiles.add(normalizedFileName);
                    } catch (IOException e) {
                        throw new RuntimeException("Could not read sound file: " + soundFile, e);
                    }
                }
            });
        } catch (RuntimeException e) {
            throw new Exception("Could not replace attachments from sounds folder", e);
        }

        attachmentRepository.saveAll(changedAttachments);
        return replacedFiles;
    }

    @Transactional
    public int replacePolishLettersInAttachmentFileNames() {
        List<Attachment> changedAttachments = new ArrayList<>();

        attachmentRepository.findAll().forEach(attachment -> {
            String normalizedFileName = replacePolishLetters(attachment.getFileName());

            if (!normalizedFileName.equals(attachment.getFileName())) {
                attachment.setFileName(normalizedFileName);
                changedAttachments.add(attachment);
            }
        });

        attachmentRepository.saveAll(changedAttachments);
        return changedAttachments.size();
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

    String replacePolishLetters(String value) {
        if (value == null) {
            return null;
        }

        String replaced = value
                .replace("ą", "a")
                .replace("ć", "c")
                .replace("ę", "e")
                .replace("ł", "l")
                .replace("ń", "n")
                .replace("ó", "o")
                .replace("ś", "s")
                .replace("ź", "z")
                .replace("ż", "z")
                .replace("Ą", "A")
                .replace("Ć", "C")
                .replace("Ę", "E")
                .replace("Ł", "L")
                .replace("Ń", "N")
                .replace("Ó", "O")
                .replace("Ś", "S")
                .replace("Ź", "Z")
                .replace("Ż", "Z");

        return Normalizer.normalize(replaced, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
    }
}
