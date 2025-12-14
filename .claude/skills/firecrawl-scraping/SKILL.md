---
name: firecrawl-scraping
description: Scrape and extract structured data from websites using Firecrawl MCP. Use when crawling websites, extracting contacts, or mapping site URLs. Requires FIRECRAWL_API_KEY.
allowed-tools: firecrawl_scrape, firecrawl_batch_scrape, firecrawl_map, firecrawl_search, firecrawl_extract, firecrawl_crawl, Read
---

# Firecrawl Web Scraping

## Quick Start

**Single page scrape:**
```
Use firecrawl_scrape with url="https://example.com/about" and formats=["markdown"]
```

**Batch scrape multiple URLs:**
```
Use firecrawl_batch_scrape with urls=["url1", "url2", ...] and formats=["markdown"]
```

**Extract structured data:**
```
Use firecrawl_extract with url="https://example.com/team" and schema for name, email, title fields
```

**Map site URLs:**
```
Use firecrawl_map with url="https://example.com" to discover all indexed pages
```

**Web search:**
```
Use firecrawl_search with query="Real Estate Brokerage Nashville" to find relevant pages
```

## Available Tools

| Tool | Purpose | Use Case |
|------|---------|----------|
| `firecrawl_scrape` | Single URL extraction | Scrape one page at a time |
| `firecrawl_batch_scrape` | Multiple URLs parallel | Bulk scraping (5+ URLs) |
| `firecrawl_map` | Discover site URLs | Find all pages on a website |
| `firecrawl_search` | Web search | Find relevant pages/sites |
| `firecrawl_crawl` | Async site crawling | Deep crawl entire sites |
| `firecrawl_extract` | LLM-powered extraction | Get structured data with schema |

## Extraction Schema Example

For extracting decision-maker contacts:
```json
{
  "schema": {
    "type": "object",
    "properties": {
      "contacts": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "first_name": {"type": "string"},
            "last_name": {"type": "string"},
            "email": {"type": "string"},
            "phone": {"type": "string"},
            "title": {"type": "string"}
          }
        }
      }
    }
  }
}
```

## Best Practices

1. **Use `onlyMainContent: true`** to filter out navbars/footers
2. **Set reasonable timeouts** (30000ms default)
3. **Batch scrape for 5+ URLs** (more efficient, fewer API calls)
4. **Use extract with LLM schema** for structured data
5. **Check rate limits** before bulk operations

## Rate Limits & Error Handling

- Check your Firecrawl plan limits
- Use batch endpoints for bulk operations
- Implement retry logic for 429 errors
- Add delays between requests if hitting limits

## Common Patterns

### Scraping Contact Pages
```
1. Use firecrawl_map to find /about, /team, /leadership pages
2. Use firecrawl_batch_scrape on those URLs
3. Use firecrawl_extract to pull structured contact data
```

### Finding Businesses
```
1. Use firecrawl_search with location query
2. Extract website URLs from results
3. Use firecrawl_map to explore each site
```

## Environment Variables
- `FIRECRAWL_API_KEY` - Required for all operations
- Get your key at: https://firecrawl.dev/app/api-keys
