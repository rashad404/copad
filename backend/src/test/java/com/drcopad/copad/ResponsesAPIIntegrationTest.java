package com.drcopad.copad;

import com.drcopad.copad.config.OpenAIResponsesConfig;
import com.drcopad.copad.service.ConversationManager;
import com.drcopad.copad.service.CostCalculationService;
import com.drcopad.copad.service.OpenAIResponsesService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
public class ResponsesAPIIntegrationTest {
    
    @Autowired
    private OpenAIResponsesService responsesService;
    
    @Autowired
    private ConversationManager conversationManager;
    
    @Autowired
    private CostCalculationService costCalculationService;
    
    @Autowired
    private OpenAIResponsesConfig responsesConfig;
    
    @Test
    public void testContextLoads() {
        assertNotNull(responsesService);
        assertNotNull(conversationManager);
        assertNotNull(costCalculationService);
        assertNotNull(responsesConfig);
    }
    
    @Test
    public void testResponsesConfigValues() {
        assertNotNull(responsesConfig.getDefaultModel());
        assertTrue(responsesConfig.getConversationTtlDays() > 0);
        assertNotNull(responsesConfig.getCost());
        assertNotNull(responsesConfig.getCost().getDailyLimit());
    }
}