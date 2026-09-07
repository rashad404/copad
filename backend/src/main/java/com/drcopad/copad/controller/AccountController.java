package com.drcopad.copad.controller;

import com.drcopad.copad.entity.User;
import com.drcopad.copad.service.RecordDeletionService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * The account itself.
 *
 * Deletion lives here rather than under a member because it removes the person
 * asking as well as everyone in their family, and that is a different promise
 * from removing one record.
 */
@Slf4j
@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {

    private final RecordDeletionService deletion;

    @Data
    public static class DeleteAccountRequest {
        private String password;
    }

    /**
     * Deletes the account and every record it holds.
     *
     * The password is required. This is irreversible and reachable from any
     * session, including one someone else has picked up, and the password is the
     * one thing a stolen token does not carry.
     *
     * A family shared with another account is left intact; this account simply
     * steps out of it. Erasing records another person also holds is not this
     * person's decision to make.
     */
    @DeleteMapping
    public Map<String, Object> deleteAccount(@RequestBody DeleteAccountRequest request,
                                             @AuthenticationPrincipal User user) {
        return Map.of("deleted", true,
                "removed", deletion.deleteAccount(user.getId(), request.getPassword()));
    }
}
