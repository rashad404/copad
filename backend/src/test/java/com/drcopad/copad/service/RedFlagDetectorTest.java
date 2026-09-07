package com.drcopad.copad.service;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * What must fire, and what must not.
 *
 * Both directions matter. A missed heart attack is catastrophic; a warning that
 * fires on every headache is one people learn to skip, which costs the same
 * thing more slowly.
 */
class RedFlagDetectorTest {

    private final RedFlagDetector detector = new RedFlagDetector();

    private List<String> categories(String message) {
        return detector.detect(message).stream()
                .map(RedFlagDetector.RedFlag::category).toList();
    }

    @Test
    void firesOnChestPainInAzerbaijani() {
        assertTrue(categories("Sinemde agri var, sol qoluma verir")
                .contains("possible heart attack"));
    }

    @Test
    void firesWithOrWithoutDiacritics() {
        // People type without them and extraction drops them.
        assertFalse(categories("Sinəmdə ağrı var").isEmpty());
        assertFalse(categories("Sinemde agri var").isEmpty());
    }

    @Test
    void firesAcrossLanguages() {
        assertTrue(categories("I have chest pain").contains("possible heart attack"));
        assertTrue(categories("боль в груди").contains("possible heart attack"));
    }

    @Test
    void firesOnStrokeSigns() {
        assertTrue(categories("Bir terefim keyidi ve danisigim pozuldu")
                .contains("possible stroke"));
        assertTrue(categories("sudden weakness on one side").contains("possible stroke"));
        assertTrue(categories("У меня перекосило лицо").contains("possible stroke"));
    }

    @Test
    void firesOnBreathingDifficulty() {
        assertTrue(categories("Nefes ala bilmirem").contains("trouble breathing"));
        assertTrue(categories("I can't breathe").contains("trouble breathing"));
    }

    @Test
    void firesOnAirwaySwelling() {
        assertTrue(categories("Dodaqlarim sisir ve bogazim tutulur")
                .contains("possible severe allergic reaction"));
        assertTrue(categories("my throat is swelling")
                .contains("possible severe allergic reaction"));
    }

    @Test
    void firesOnSuicidalIdeation() {
        assertTrue(categories("Yasamaq istemirem").contains("thoughts of suicide"));
        assertTrue(categories("I want to kill myself").contains("thoughts of suicide"));
    }

    @Test
    void firesOnFeverInAYoungInfant() {
        // Under three months a fever is an emergency however well the baby looks.
        assertTrue(categories("2 ayliq korpede herareti var")
                .contains("fever in a very young baby"));
        assertTrue(categories("newborn has a fever").contains("fever in a very young baby"));
    }

    @Test
    void doesNotFireOnAnOrdinaryComplaint() {
        // The cases that must stay quiet, or the warning stops meaning anything.
        assertTrue(categories("Basim agriyir").isEmpty());
        assertTrue(categories("I have a headache and a sore throat").isEmpty());
        assertTrue(categories("Qarnim agriyir, dunenden beri").isEmpty());
        assertTrue(categories("Ayagim agriyir").isEmpty());
        assertTrue(categories("Nurofen qiymeti nece manatdir?").isEmpty());
        assertTrue(categories("Vitamin D haqqinda sual").isEmpty());
    }

    @Test
    void doesNotFireOnASingleAlarmingWord() {
        // "Pain" alone is most of medicine; only a described pattern counts.
        assertTrue(categories("agri").isEmpty());
        assertTrue(categories("pain").isEmpty());
        assertTrue(categories("swelling").isEmpty());
    }

    @Test
    void doesNotFireWhenTheSymptomIsDenied() {
        assertTrue(categories("Sinemde agri yoxdur").isEmpty());
        assertTrue(categories("no chest pain").isEmpty());
    }

    @Test
    void reportsEverySeparateFlag() {
        var found = categories("Sinemde agri var ve nefes ala bilmirem");
        assertTrue(found.contains("possible heart attack"));
        assertTrue(found.contains("trouble breathing"));
    }

    @Test
    void theContextBlockLeadsWithTheEmergencyNumber() {
        String block = detector.contextFor("Sinemde agri var");
        assertTrue(block.contains(RedFlagDetector.EMERGENCY_NUMBERS));
        assertTrue(block.contains("possible heart attack"));
        assertTrue(block.toUpperCase().contains("URGENT"));
    }

    @Test
    void thereIsNoContextForAnOrdinaryMessage() {
        // The common case, and it must add nothing to the prompt.
        assertEquals("", detector.contextFor("Basim agriyir"));
        assertEquals("", detector.contextFor(""));
        assertEquals("", detector.contextFor(null));
    }
}
