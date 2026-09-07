package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.repository.*;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;
import java.util.Optional;
import java.nio.charset.StandardCharsets;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class DocumentConsentTest {
    @Mock DocumentRepository documentRepository;
    @Mock LabResultRepository labResultRepository;
    @Mock UserRepository userRepository;
    @Mock FamilyService familyService;
    @Mock DocumentStorageService storage;
    @Mock DocumentExtractionService extraction;
    @Mock ConsentService consents;
    @Mock LabReportParser labParser;
    @Mock PrescriptionParser prescriptionParser;
    @Mock MedicationRepository medicationRepository;
    @InjectMocks DocumentService service;

    @Test void aRefusalIsCheckedWhenTheBackgroundJobRuns() throws Exception {
        Document document = new Document();
        document.setId(7L); document.setStorageKey("stored"); document.setContentType("image/png");
        User user = new User(); user.setId(1L); document.setUploadedBy(user);
        when(documentRepository.findByIdAndDeletedAtIsNull(7L)).thenReturn(Optional.of(document));
        when(consents.hasRefused(1L, ConsentType.CROSS_BORDER_AI)).thenReturn(true);
        byte[] bytes = new byte[]{1}; when(storage.readAllBytes("stored")).thenReturn(bytes);
        service.extractAsync(7L);
        verify(extraction).extractText(bytes, "image/png", false);
        assertEquals(ExtractionStatus.SKIPPED, document.getExtractionStatus());
        assertEquals("AI_PROCESSING_DECLINED", document.getExtractionError());
    }

    @Test void refusedImagesNeverReachTheExternalProviderButLocalTextStillWorks() {
        VisionOcrService ocr = mock(VisionOcrService.class);
        DocumentExtractionService extraction = new DocumentExtractionService(ocr);
        assertNull(extraction.extractText(new byte[]{1}, "image/png", false));
        assertEquals("Hemoglobin 9.4", extraction.extractText("Hemoglobin 9.4".getBytes(StandardCharsets.UTF_8), "text/plain", false));
        verifyNoInteractions(ocr);
    }
}
