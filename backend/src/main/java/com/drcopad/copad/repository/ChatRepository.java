package com.drcopad.copad.repository;

import com.drcopad.copad.entity.Chat;
import com.drcopad.copad.entity.GuestSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findByGuestSessionOrderByUpdatedAtDesc(GuestSession guestSession);
    Optional<Chat> findByChatId(String chatId);
    List<Chat> findByGuestSessionAndChatId(GuestSession guestSession, String chatId);
}