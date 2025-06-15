# OpenAI Responses API Migration Guide

## Overview

This document details the migration from the stateless ChatGPT API to OpenAI's new stateful Responses API for the medical virtual assistant application.

## Key Changes

### 1. **Stateful Conversations**
- **Before**: Sent full conversation history with each request
- **After**: Uses `previous_response_id` for conversation continuity
- **Benefit**: Reduced token usage, better context retention

### 2. **Advanced Tool Integration**
- File Search: Analyze medical documents with citations
- Code Interpreter: Perform medical calculations
- Web Search: Get up-to-date medical information (disabled by default due to cost)

### 3. **Multi-File Upload Support**
- Drag-and-drop interface for multiple medical documents
- Batch processing with progress tracking
- Medical-specific file categorization

## Architecture Changes

### Database Schema

New tables added:
- `conversations` - Tracks OpenAI conversation state
- `openai_responses` - Stores response metadata
- `conversation_files` - Links files to conversations
- `usage_metrics` - Monitors token usage and costs
- `batch_file_uploads` - Tracks multi-file upload batches

### Service Layer

1. **OpenAIResponsesService** - Main service for Responses API
2. **ConversationManager** - Manages conversation lifecycle
3. **CostCalculationService** - Tracks usage and costs
4. **FileUploadService** - Handles batch file uploads

## Configuration

### Enable Responses API

Set in `application.yml`:
```yaml
app:
  chatgpt:
    openai:
      responses:
        enabled: true  # Enable Responses API
        fallback-to-chat: true  # Fallback to ChatGPT if needed
```

### Environment Variables
```bash
OPENAI_RESPONSES_ENABLED=true
OPENAI_API_KEY=your-api-key
```

## API Endpoints

### New Endpoints

1. **Send Message with Responses API**
   ```
   POST /api/v2/messages/chat/{chatId}
   ```

2. **Batch File Upload**
   ```
   POST /api/v2/messages/chat/{chatId}/files/batch
   ```

3. **Conversation Statistics**
   ```
   GET /api/v2/messages/chat/{chatId}/stats
   ```

4. **Daily Usage Summary**
   ```
   GET /api/v2/messages/usage/daily
   ```

## Frontend Integration

### Multi-File Upload Component

```typescript
import { MultiFileUpload } from '@/components/MultiFileUpload';

<MultiFileUpload
  chatId={chatId}
  category="lab-results"
  onFilesSelected={handleFiles}
  onUploadComplete={handleComplete}
/>
```

### Medical File Categories
- `lab-results` - Blood tests, pathology reports
- `imaging` - X-rays, MRI, CT scans
- `prescriptions` - Medication lists
- `clinical-notes` - Doctor notes, summaries

## Cost Management

### Pricing (as of 2024)
- GPT-4o: $0.015/1K input, $0.060/1K output
- GPT-4o-mini: $0.00015/1K input, $0.0006/1K output
- File Search: $0.10 per query
- Code Interpreter: $0.03 per session

### Cost Controls
- Daily spending limits per user
- Real-time cost tracking
- Automatic alerts at thresholds

## Migration Strategy

### Phase 1: Dual Mode (Recommended)
1. Deploy with `responses.enabled=false`
2. Test thoroughly
3. Enable for specific users/sessions
4. Monitor costs and performance

### Phase 2: Gradual Rollout
1. Enable for 10% of traffic
2. Monitor error rates and costs
3. Increase to 50%, then 100%

### Phase 3: Full Migration
1. Set `responses.enabled=true` for all
2. Keep `fallback-to-chat=true` for reliability
3. Monitor and optimize

## Medical Safety Considerations

1. **Disclaimers**: All medical disclaimers preserved
2. **Specialty Prompts**: Maintained for each medical field
3. **PHI Protection**: Files encrypted in transit
4. **Audit Logging**: All interactions logged

## Performance Considerations

### Response Times
- Responses API: ~2-5 seconds (with tools)
- ChatGPT API: ~1-3 seconds
- File processing adds 1-2 seconds per file

### Optimization Tips
1. Cache conversation states
2. Use async file uploads
3. Implement progress indicators
4. Set appropriate timeouts

## Monitoring

### Key Metrics
- Conversation success rate
- Average response time
- Token usage per conversation
- Daily cost per user
- File upload success rate

### Health Checks
```
GET /actuator/health
GET /actuator/metrics/openai.responses
```

## Troubleshooting

### Common Issues

1. **Conversation Expired**
   - Solution: Start new conversation
   - Prevention: Extend TTL in config

2. **Cost Limit Exceeded**
   - Solution: Increase limits or wait
   - Prevention: Monitor usage patterns

3. **File Upload Failed**
   - Check file size/format
   - Verify OpenAI API status
   - Check network connectivity

## Rollback Plan

If issues arise:
1. Set `responses.enabled=false`
2. All requests auto-fallback to ChatGPT
3. No code changes required
4. User experience unchanged

## Security Notes

1. API keys stored securely in environment
2. File uploads validated before processing
3. Rate limiting prevents abuse
4. Cost limits prevent runaway charges

## Future Enhancements

1. **Assistant API Integration**
2. **Voice Input/Output**
3. **Real-time Streaming**
4. **Advanced Analytics Dashboard**

## Support

For issues or questions:
- Check application logs
- Monitor `/actuator/health`
- Review cost dashboard
- Contact development team

---

**Note**: This migration maintains all existing medical safety features while adding powerful new capabilities for document analysis and stateful conversations.