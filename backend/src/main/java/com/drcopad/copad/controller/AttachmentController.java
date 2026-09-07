package com.drcopad.copad.controller;

import com.drcopad.copad.entity.FileAttachment;
import com.drcopad.copad.repository.FileAttachmentRepository;
import com.drcopad.copad.service.AttachmentStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

/**
 * Files attached to a chat.
 *
 * Replaces the static /uploads/** handler, which served anything in the upload
 * directory to anyone who asked. A file here is returned only to the session it
 * belongs to.
 *
 * The session id is what the whole conversation is already protected by, so it
 * is the right key for its attachments too. It is accepted as a query parameter
 * as well as a header because an <img> tag cannot send headers.
 */
@Slf4j
@RestController
@RequestMapping("/api/attachments")
@RequiredArgsConstructor
public class AttachmentController {

    private final FileAttachmentRepository attachments;
    private final AttachmentStorageService storage;

    @GetMapping("/{fileId}")
    public ResponseEntity<?> content(@PathVariable String fileId,
                                     @RequestHeader(value = "X-Session-Id", required = false)
                                     String headerSession,
                                     @RequestParam(value = "s", required = false) String querySession) {

        FileAttachment attachment = attachments.findByFileId(fileId).orElse(null);
        // Not found and not yours are the same response: otherwise the endpoint
        // reports which file ids exist.
        if (attachment == null || !belongsTo(attachment, headerSession, querySession)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        try {
            var stream = storage.read(attachment);
            return ResponseEntity.ok()
                    .contentType(mediaType(attachment))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + safeName(attachment) + "\"")
                    // Patient data must not sit in a shared cache.
                    .header(HttpHeaders.CACHE_CONTROL, "private, no-store")
                    .body(new InputStreamResource(stream));
        } catch (IOException e) {
            log.warn("Attachment {} has no readable file", attachment.getId());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    private boolean belongsTo(FileAttachment attachment, String header, String query) {
        String owner = attachment.getGuestSession() == null
                ? null : attachment.getGuestSession().getSessionId();
        // An attachment with no session cannot be proven to belong to anyone,
        // so it is never served.
        if (owner == null) return false;
        return owner.equals(header) || owner.equals(query);
    }

    private MediaType mediaType(FileAttachment attachment) {
        try {
            return MediaType.parseMediaType(attachment.getFileType());
        } catch (Exception e) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }
    }

    /** Never the original filename: it commonly carries the patient's name. */
    private String safeName(FileAttachment attachment) {
        boolean image = attachment.getFileType() != null
                && attachment.getFileType().startsWith("image/");
        return (image ? "image" : "document")
                + AttachmentStorageService.extensionFor(attachment.getFileType());
    }
}
