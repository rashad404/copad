package com.drcopad.copad.service;

import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RateLimiterService {
    private static final int MAX_REQUESTS_PER_HOUR = 100;
    private static final String RATE_LIMIT_CACHE = "rateLimit";
    
    private final CacheManager cacheManager;

    public RateLimiterService(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    public boolean isAllowed(String key) {
        Cache cache = cacheManager.getCache(RATE_LIMIT_CACHE);
        if (cache == null) {
            return true; // If cache is not available, allow the request
        }

        Integer count = cache.get(key, Integer.class);
        if (count == null) {
            cache.put(key, 1);
            return true;
        }

        if (count >= MAX_REQUESTS_PER_HOUR) {
            return false;
        }

        cache.put(key, count + 1);
        return true;
    }

    public void resetLimit(String key) {
        Cache cache = cacheManager.getCache(RATE_LIMIT_CACHE);
        if (cache != null) {
            cache.evict(key);
        }
    }
} 