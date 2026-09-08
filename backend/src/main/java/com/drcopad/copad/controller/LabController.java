package com.drcopad.copad.controller;

import com.drcopad.copad.entity.Lab;
import com.drcopad.copad.entity.LabTest;
import com.drcopad.copad.repository.LabRepository;
import com.drcopad.copad.repository.LabTestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * The public laboratory directory.
 *
 * Prices are what the laboratory charges. Nothing here is settled through
 * azdoc, and no wording should suggest otherwise.
 */
@RestController
@RequestMapping("/api/labs")
@RequiredArgsConstructor
public class LabController {

    private final LabRepository labs;
    private final LabTestRepository tests;

    @GetMapping
    public Page<Map<String, Object>> search(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "false") boolean homeCollection,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return labs.search(blank(city), homeCollection, blank(q),
                        PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50)))
                .map(this::summary);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Map<String, Object>> one(
            @PathVariable String slug,
            @RequestParam(defaultValue = "az") String lang) {

        return labs.findBySlugAndDeletedAtIsNullAndActiveTrue(slug)
                .map(lab -> {
                    Map<String, Object> body = new LinkedHashMap<>(summary(lab));
                    body.put("description", lab.getDescription());
                    body.put("tests", tests
                            .findByLabIdAndActiveTrueOrderByNameAzAsc(lab.getId())
                            .stream().map(t -> test(t, language(lang))).toList());
                    return ResponseEntity.ok(body);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{slug}/tests")
    public ResponseEntity<List<Map<String, Object>>> tests(
            @PathVariable String slug,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "az") String lang) {

        return labs.findBySlugAndDeletedAtIsNullAndActiveTrue(slug)
                .map(lab -> ResponseEntity.ok(tests.search(lab.getId(), blank(q)).stream()
                        .map(t -> test(t, language(lang))).toList()))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * One test, priced at every laboratory that offers it.
     *
     * The reason the catalogue exists. Cheapest first, and a laboratory that
     * does not publish a price for it comes last rather than looking free.
     */
    @GetMapping("/compare/{analyteKey}")
    public List<Map<String, Object>> compare(@PathVariable String analyteKey,
                                             @RequestParam(defaultValue = "az") String lang) {
        String language = language(lang);
        return tests.byAnalyte(analyteKey).stream().map(t -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("labSlug", t.getLab().getSlug());
            row.put("labName", t.getLab().getName());
            row.put("labCity", t.getLab().getCity());
            row.put("homeCollection", t.getLab().isHomeCollection());
            row.put("name", t.nameIn(language));
            row.put("price", t.getPrice());
            row.put("turnaroundHours", t.getTurnaroundHours());
            return row;
        }).toList();
    }

    /**
     * Which tests can be compared at all, with what it costs to have each done.
     *
     * The keys alone were not enough to build anything on: a comparison index
     * has to be able to name a test in the reader's language and say what the
     * range is, or it is a list of database identifiers.
     */
    @GetMapping("/comparable")
    public List<Map<String, Object>> comparable(@RequestParam(defaultValue = "az") String lang) {
        String language = language(lang);
        List<String> keys = tests.comparableAnalytes();
        if (keys.isEmpty()) return List.of();

        Map<String, List<LabTest>> byKey = new LinkedHashMap<>();
        for (String key : keys) byKey.put(key, new ArrayList<>());
        for (LabTest t : tests.byAnalytes(keys)) {
            List<LabTest> group = byKey.get(t.getAnalyteKey());
            if (group != null) group.add(t);
        }

        List<Map<String, Object>> out = new ArrayList<>();
        byKey.forEach((key, group) -> {
            if (group.isEmpty()) return;
            List<BigDecimal> prices = group.stream()
                    .map(LabTest::getPrice)
                    .filter(Objects::nonNull)
                    .sorted()
                    .toList();
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("key", key);
            // The cheapest offer names the analyte, since that is the row a
            // reader lands on first anyway.
            row.put("name", group.get(0).nameIn(language));
            row.put("labCount", group.stream().map(t -> t.getLab().getId()).distinct().count());
            row.put("lowest", prices.isEmpty() ? null : prices.get(0));
            row.put("highest", prices.isEmpty() ? null : prices.get(prices.size() - 1));
            out.add(row);
        });
        // Where the difference is largest is where the page is worth reading.
        out.sort(Comparator.comparing(
                (Map<String, Object> row) -> saving(row), Comparator.reverseOrder()));
        return out;
    }

    /** What a reader saves by choosing the cheaper laboratory, or zero. */
    private static BigDecimal saving(Map<String, Object> row) {
        BigDecimal low = (BigDecimal) row.get("lowest");
        BigDecimal high = (BigDecimal) row.get("highest");
        if (low == null || high == null) return BigDecimal.ZERO;
        return high.subtract(low);
    }

    private Map<String, Object> summary(Lab lab) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", lab.getId());
        row.put("slug", lab.getSlug());
        row.put("name", lab.getName());
        row.put("city", lab.getCity());
        row.put("district", lab.getDistrict());
        row.put("address", lab.getAddress());
        row.put("phone", lab.getPhone());
        row.put("homeCollection", lab.isHomeCollection());
        row.put("homeCollectionFee", lab.getHomeCollectionFee());
        row.put("testCount", tests.countByLabIdAndActiveTrue(lab.getId()));
        return row;
    }

    /** Named and explained in the language being read, resolved server-side. */
    private Map<String, Object> test(LabTest t, String language) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", t.getId());
        row.put("code", t.getCode());
        row.put("name", t.nameIn(language));
        row.put("analyteKey", t.getAnalyteKey());
        row.put("sampleType", t.getSampleType());
        row.put("price", t.getPrice());
        row.put("turnaroundHours", t.getTurnaroundHours());
        row.put("preparation", t.preparationIn(language));
        return row;
    }

    private static String language(String lang) {
        return switch (lang == null ? "az" : lang.toLowerCase()) {
            case "en", "ru" -> lang.toLowerCase();
            default -> "az";
        };
    }

    private static String blank(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
