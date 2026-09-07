package com.drcopad.copad.service;

import com.drcopad.copad.config.ChatGPTConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.reactive.function.client.WebClient;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * When transcription must not run.
 *
 * Every case here ends in null rather than an exception, because a document
 * that cannot be read is still stored and still viewable - the caller records a
 * skipped extraction, and the person keeps their file.
 */
class VisionOcrServiceTest {

    private AiSpendService spend;
    private VisionOcrService ocr;

    @BeforeEach
    void setUp() {
        spend = mock(AiSpendService.class);
        // A real call would need the network; every case here must return
        // before reaching it, which is the point.
        ocr = new VisionOcrService(mock(WebClient.class), new ChatGPTConfig(), spend);
        ReflectionTestUtils.setField(ocr, "enabled", true);
        ReflectionTestUtils.setField(ocr, "model", "gpt-4o");
    }

    @Test
    void doesNothingWhenTurnedOff() {
        ReflectionTestUtils.setField(ocr, "enabled", false);
        assertNull(ocr.transcribe(new byte[]{1, 2, 3}, "image/png"));
        verifyNoInteractions(spend);
    }

    @Test
    void doesNotSpendOnAnEmptyImage() {
        assertNull(ocr.transcribe(new byte[0], "image/png"));
        assertNull(ocr.transcribe(null, "image/png"));
        verifyNoInteractions(spend);
    }

    @Test
    void refusesAnImageTooLargeToBeWorthSending() {
        assertNull(ocr.transcribe(new byte[21 * 1024 * 1024], "image/jpeg"));
        verifyNoInteractions(spend);
    }

    @Test
    void stopsAtTheDailyCeiling() {
        // A folder of scans must not spend the budget the assistant needs, and
        // the ceiling has to be checked before the call, not after.
        doThrow(new AiSpendService.BudgetExhaustedException("no budget"))
                .when(spend).requireBudget();

        assertNull(ocr.transcribe(new byte[]{1, 2, 3}, "image/png"));
        verify(spend).requireBudget();
        verify(spend, never()).record(any(), anyInt(), anyInt(), any());
    }

    @Test
    void checksTheBudgetBeforeAnythingElse() {
        ocr.transcribe(new byte[]{1, 2, 3}, "image/png");
        verify(spend).requireBudget();
    }
}
