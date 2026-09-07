package com.drcopad.copad.entity;

/**
 * Where a document is in the extraction pipeline.
 *
 * Upload and extraction are separate: a scanned report can take seconds to OCR,
 * and holding the request open for it would make uploading feel broken.
 */
public enum ExtractionStatus {
    PENDING,
    PROCESSING,
    /** Text extracted; any values found are proposals awaiting confirmation. */
    COMPLETED,
    /** Nothing readable, e.g. a photo too blurred to OCR. The file is still kept. */
    FAILED,
    /** Nothing to extract, e.g. an image with no text layer. */
    SKIPPED
}
