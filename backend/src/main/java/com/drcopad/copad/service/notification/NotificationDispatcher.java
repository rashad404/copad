package com.drcopad.copad.service.notification;

import com.drcopad.copad.entity.Notification;
import com.drcopad.copad.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Picks up what is due and hands each one to the sender.
 *
 * On a timer rather than inline, so nothing a person does waits on a mail
 * server, and a message that fails is tried again instead of vanishing. Three
 * attempts, then it is left alone: a repeatedly failing address is usually
 * wrong, and retrying it forever only delays everybody else.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationDispatcher {

    static final int MAX_ATTEMPTS = 3;
    private static final int BATCH = 40;

    private final NotificationRepository notifications;
    private final NotificationSender sender;

    @Value("${app.notifications.enabled:true}")
    private boolean enabled;

    @Scheduled(fixedDelayString = "${app.notifications.interval-ms:60000}")
    public void send() {
        if (!enabled) return;
        List<Notification> due = notifications.due(
                LocalDateTime.now(), MAX_ATTEMPTS, PageRequest.of(0, BATCH));
        for (Notification row : due) {
            sender.deliver(row.getId());
        }
    }
}
