# OpenAI Responses API Migration

## Overview
This document summarizes the migration from the stateless ChatGPT API to the stateful OpenAI Responses API.

## Changes Implemented

### 1. Database Schema Updates
Created new tables for conversation state management:
- `conversations` - Tracks OpenAI conversation state with 30-day TTL
- `openai_responses` - Stores response metadata and chaining information
- `conversation_files` - Links files to conversations
- `usage_metrics` - Tracks token usage and costs
- `batch_file_uploads` - Manages batch file upload operations

### 2. Core Services Implemented
- **OpenAIResponsesService** - Main service for Responses API integration with circuit breaker and retry logic
- **ConversationManager** - Manages conversation lifecycle and state persistence
- **CostCalculationService** - Tracks usage costs with daily limits and alerts
- **FileUploadService** - Handles batch medical file uploads with categorization

### 3. API Endpoints
New endpoints under `/api/v2/messages`:
- `POST /chat/{chatId}` - Send messages using Responses API (dual-mode support)
- `POST /chat/{chatId}/files/batch` - Upload multiple medical files
- `GET /files/batch/{batchId}/status` - Check batch upload status
- `GET /chat/{chatId}/stats` - Get conversation statistics
- `GET /usage/daily` - Get daily usage summary

### 4. Configuration
Added comprehensive configuration in `application.yml`:
```yaml
app:
  chatgpt:
    openai:
      responses:
        enabled: false  # Set to true to enable Responses API
        url: https://api.openai.com/v1/responses
        fallback-to-chat: true
        default-model: gpt-4o-mini
        conversation-ttl-days: 30
        tools:
          file-search: true
          web-search: false
          code-interpreter: true
        cost:
          alert-threshold: 10.00
          daily-limit: 50.00
```

### 5. Resilience Patterns
Implemented circuit breaker and retry patterns using Resilience4j:
- Circuit breaker opens after 50% failure rate
- Automatic retry with exponential backoff
- Fallback to ChatGPT API when Responses API fails

### 6. Frontend Components
Created React component for multi-file upload with:
- Drag-and-drop support
- Medical file categorization
- Progress tracking
- File validation

## Deployment Instructions

1. **Database Migration**
   - Run Flyway migrations to create new tables
   - Ensure MySQL 5.7 compatibility

2. **Configuration**
   - Set `OPENAI_RESPONSES_ENABLED=true` to enable the new API
   - Configure cost limits and thresholds
   - Set up monitoring endpoints

3. **Gradual Rollout**
   - Start with `responses.enabled=false` (uses ChatGPT API)
   - Monitor application health
   - Gradually enable for specific users/sessions
   - Full rollout when stable

## Testing
- Unit tests for all new services
- Integration tests for API endpoints
- Load testing for batch file uploads
- Cost calculation verification

## Monitoring
- Health indicators for circuit breaker states
- Metrics for API response times
- Cost tracking dashboards
- Conversation state monitoring