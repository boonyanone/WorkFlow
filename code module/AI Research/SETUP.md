# AI Research Module - Setup Guide

## 🚀 Quick Setup

### 1. API Keys Configuration

Copy the environment file and add your API keys:

```bash
cp .env.example .env
```

Edit `.env` file with your actual API keys:

```env
# At minimum, add one API key to get started
OPENAI_API_KEY=sk-your-openai-key-here

# Optional: Add more providers for better coverage
ANTHROPIC_API_KEY=your-anthropic-key-here
GOOGLE_AI_API_KEY=your-google-ai-key-here
TYPHOON_API_KEY=your-typhoon-key-here
```

### 2. File Permissions

Ensure proper file permissions:

```bash
chmod 644 *.php
chmod 644 assets/*
chmod 600 .env
```

### 3. Test the Module

Visit your FlowWork installation and:

1. Go to AI Research module
2. Try a simple query like "แนวโน้มเทคโนโลยี AI ในปี 2025"
3. Check browser console for any errors

## 🔑 Getting API Keys

### OpenAI (GPT-4)
1. Visit https://platform.openai.com/api-keys
2. Create new API key
3. Add billing information (pay-per-use)
4. **Cost**: ~$0.015 per 1K tokens

### Anthropic (Claude)
1. Visit https://console.anthropic.com/
2. Create API key
3. Add billing information
4. **Cost**: ~$0.018 per 1K tokens

### Google (Gemini)
1. Visit https://ai.google.dev/
2. Get API key from Google AI Studio
3. **Cost**: ~$0.007 per 1K tokens (cheapest option)

### SCB Typhoon (Thailand)
1. Visit https://www.scb10x.com/typhoon
2. Request access for Thai language support
3. **Cost**: ~$0.012 per 1K tokens

## 📊 Cost Estimation

**Monthly costs for 1000 research queries:**

| Provider | Cost per Query | Monthly Cost | Quality |
|----------|---------------|--------------|---------|
| Gemini   | ฿0.24        | ฿240         | Good    |
| Typhoon  | ฿0.41        | ฿410         | Thai+++ |
| Claude   | ฿0.61        | ฿610         | Great   |
| GPT-4    | ฿0.51        | ฿510         | Best    |

**Recommended Setup:**
- **Budget**: Gemini only (฿240/month)
- **Balanced**: Gemini + GPT-4 (฿375/month average)
- **Premium**: All providers (฿455/month average)

## 🔧 Configuration Options

### Credit System
```env
CREDIT_RATE_THB=1.60        # ฿1.60 per credit
DEFAULT_USER_CREDITS=1246   # Starting credits
```

### Rate Limiting
```env
MAX_REQUESTS_PER_MINUTE=60     # Per provider
MAX_TOKENS_PER_MINUTE=150000   # Per provider
```

### Debug Mode
```env
AI_DEBUG_MODE=true          # Enable detailed logging
LOG_API_USAGE=true          # Log all API calls
```

## 🛠️ Troubleshooting

### Module Not Loading
1. Check PHP error logs
2. Verify file permissions
3. Ensure FlowWork core is working

### API Errors
1. Verify API keys are correct
2. Check API quota/billing
3. Review rate limiting settings

### JavaScript Errors
1. Check browser console
2. Verify API endpoints are accessible
3. Test with browser network tab

### No AI Responses
1. Check if any API keys are configured
2. Module will fall back to simulation mode
3. Look for "📝 No API keys configured" in console

## 📝 Testing Commands

### Test API Endpoints Directly
```bash
# Test status endpoint
curl "https://work.flow.in.th/code module/AI Research/api-endpoints.php?action=status"

# Test research endpoint
curl -X POST "https://work.flow.in.th/code module/AI Research/api-endpoints.php?action=research" \
  -H "Content-Type: application/json" \
  -d '{"query":"test","persona":"general","model":"auto"}'
```

### Check PHP Configuration
```php
<?php
// Add to test file
require_once 'ai-api-handler.php';
$handler = new AIAPIHandler();
var_dump($handler->getProviderStatus());
?>
```

## 🔄 Updates

The module will automatically detect API availability and fall back to simulation mode if no APIs are configured. This allows for:

1. **Demo Mode**: Works without any API keys
2. **Gradual Setup**: Add API keys one by one
3. **Cost Control**: Use cheaper providers first

## 📞 Support

If you encounter issues:

1. Check the browser console for JavaScript errors
2. Check PHP error logs for server-side issues
3. Verify API keys are working with provider documentation
4. Test with minimal configuration first (just one API key)

## 🚀 Next Steps

Once basic setup is working:

1. Configure team collaboration features
2. Set up export to Google Docs/Word
3. Implement usage analytics
4. Add custom personas for your organization