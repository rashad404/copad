package com.drcopad.copad.service;

import com.drcopad.copad.entity.Specialty;
import com.drcopad.copad.repository.ClinicRepository;
import com.drcopad.copad.repository.SpecialtyRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;

/**
 * Turning "uşağımın qulağı ağrıyır, Gəncədəyik" into a filtered search.
 *
 * The model chooses nothing of its own: it is given our real specialty codes
 * and the cities we actually have clinics in, and anything it returns that is
 * not on those lists is dropped. A directory that searches for a specialty
 * that does not exist is worse than one that searches for nothing.
 *
 * It picks a department. It does not say what is wrong with anybody, and the
 * prompt says so twice, because a model asked about symptoms will otherwise
 * volunteer a diagnosis.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DoctorSearchIntentService {

    /** Long enough for a sentence about a symptom, short enough to bound cost. */
    public static final int MAX_INPUT = 240;

    private final SpecialtyRepository specialties;
    private final ClinicRepository clinics;
    private final RedFlagDetector redFlags;
    private final ObjectMapper json = new ObjectMapper();

    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(8))
            .build();

    @Value("${app.deepseek.key:}")
    private String apiKey;

    @Value("${app.deepseek.url:https://api.deepseek.com/chat/completions}")
    private String apiUrl;

    @Value("${app.deepseek.model:deepseek-chat}")
    private String model;

    /**
     * What the search should be filtered by.
     *
     * @param specialty a code from our taxonomy, or null
     * @param city      a city we have clinics in, or null
     * @param query     free text to match a name on, when somebody typed a name
     * @param urgent    whether what they described needs emergency care now
     */
    public record Intent(String specialty, String city, String query, boolean urgent) {
    }

    public boolean available() {
        return apiKey != null && !apiKey.isBlank();
    }

    @Transactional(readOnly = true)
    public Intent interpret(String text) {
        String input = text == null ? "" : text.trim();
        if (input.length() > MAX_INPUT) input = input.substring(0, MAX_INPUT);
        if (input.isBlank()) return new Intent(null, null, null, false);

        // Checked here, not by the model. A rule that decides whether somebody
        // is told to call 103 does not belong to something that can be talked
        // out of it.
        boolean urgent = !redFlags.detect(input).isEmpty();

        if (!available()) {
            // No key: the box still works, as a name search.
            return new Intent(null, null, input, urgent);
        }

        Map<String, String> allowedSpecialties = new LinkedHashMap<>();
        for (Specialty specialty : specialties.findByActiveTrueOrderBySortOrderAscNameEnAsc()) {
            allowedSpecialties.put(specialty.getCode(), specialty.getNameAz());
        }
        List<String> cities = clinics.distinctCities();

        try {
            JsonNode answer = ask(input, allowedSpecialties, cities);
            String specialty = clean(answer.path("specialty").asText(null));
            String city = clean(answer.path("city").asText(null));
            String name = clean(answer.path("name").asText(null));

            // Everything the model says is checked against what exists.
            if (specialty != null && !allowedSpecialties.containsKey(specialty)) {
                log.info("Search intent returned an unknown specialty, dropped");
                specialty = null;
            }
            String proposedCity = city;
            if (city != null && cities.stream().noneMatch(c -> c.equalsIgnoreCase(proposedCity))) {
                city = null;
            }
            if (specialty == null && city == null && name == null) {
                return new Intent(null, null, input, urgent);
            }
            return new Intent(specialty, city, name, urgent);
        } catch (Exception e) {
            // The box must never be a dead end. What somebody typed is not
            // logged: it describes a symptom.
            log.warn("Search intent failed ({}), falling back to text search",
                    e.getClass().getSimpleName());
            return new Intent(null, null, input, urgent);
        }
    }

    private JsonNode ask(String input, Map<String, String> allowedSpecialties,
                         List<String> cities) throws Exception {
        StringBuilder list = new StringBuilder();
        allowedSpecialties.forEach((code, name) ->
                list.append(code).append(" = ").append(name).append("\n"));

        String system = """
                You map what a person typed into filters for a doctor directory
                in Azerbaijan. Answer with JSON only.

                {"specialty": "<code or null>", "city": "<city or null>",
                 "name": "<a doctor name they typed, or null>"}

                Rules:
                - specialty MUST be one of the codes below, exactly, or null.
                - city MUST be one of the cities below, exactly, or null.
                - name only when they typed a person's name, not a symptom.
                - You are choosing a department to search. You are NOT
                  diagnosing, and you never write anything except the JSON.
                - A symptom in a child means the paediatric department where
                  one exists.
                - If you cannot tell, use null. Guessing wrongly sends somebody
                  to the wrong doctor.

                SPECIALTY CODES:
                %s
                CITIES:
                %s
                """.formatted(list, String.join(", ", cities));

        Map<String, Object> body = Map.of(
                "model", model,
                "temperature", 0,
                "max_tokens", 120,
                "response_format", Map.of("type", "json_object"),
                "messages", List.of(
                        Map.of("role", "system", "content", system),
                        Map.of("role", "user", "content", input)));

        HttpRequest request = HttpRequest.newBuilder(URI.create(apiUrl))
                .timeout(Duration.ofSeconds(12))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(json.writeValueAsString(body)))
                .build();

        HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() >= 300) {
            throw new IllegalStateException("DeepSeek answered " + response.statusCode());
        }
        String content = json.readTree(response.body())
                .path("choices").path(0).path("message").path("content").asText("{}");
        return json.readTree(content);
    }

    private static String clean(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        if (trimmed.isEmpty() || trimmed.equalsIgnoreCase("null")) return null;
        return trimmed.length() > 120 ? trimmed.substring(0, 120) : trimmed;
    }
}
