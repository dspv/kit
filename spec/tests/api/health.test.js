/**
 * API Tests - Health Endpoints
 * RepoKIT Standard: /healthz and /readyz endpoints must work correctly
 */

const { test, expect } = require('@playwright/test');
const { ApiClient } = require('../helpers/api-client');

test.describe('Health Endpoints API Tests', () => {
  let apiClient;

  test.beforeEach(async ({ page }) => {
    apiClient = new ApiClient(page);
  });

  test('GET /healthz returns 200 OK when service is alive', async () => {
    const health = await apiClient.healthCheck();
    
    expect(health.status).toBe(200);
    expect(health.ok).toBe(true);
  });

  test('GET /healthz response has correct structure', async ({ page }) => {
    const response = await page.request.fetch(`${apiClient.baseUrl}/healthz`);
    const data = await response.json();
    
    expect(response.status()).toBe(200);
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('service');
    expect(new Date(data.timestamp)).toBeInstanceOf(Date);
  });

  test('GET /readyz returns appropriate status based on dependencies', async () => {
    const readiness = await apiClient.readinessCheck();
    
    // Should return either 200 (ready) or 503 (not ready)
    expect([200, 503]).toContain(readiness.status);
    
    if (readiness.data) {
      expect(readiness.data).toHaveProperty('status');
      expect(readiness.data).toHaveProperty('timestamp');
      expect(readiness.data).toHaveProperty('service');
      expect(readiness.data).toHaveProperty('dependencies');
      expect(['ready', 'not_ready']).toContain(readiness.data.status);
    }
  });

  test('GET /readyz response includes dependency status', async ({ page }) => {
    const response = await page.request.fetch(`${apiClient.baseUrl}/readyz`);
    const data = await response.json();
    
    expect(data).toHaveProperty('dependencies');
    expect(typeof data.dependencies).toBe('object');
    
    // Check that dependencies have expected structure
    for (const [depName, depInfo] of Object.entries(data.dependencies)) {
      expect(depInfo).toHaveProperty('component');
      expect(depInfo).toHaveProperty('status');
      expect(['healthy', 'unhealthy']).toContain(depInfo.status);
    }
  });

  test('Health endpoints respond within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    // Test /healthz response time
    const healthResponse = await page.request.fetch(`${apiClient.baseUrl}/healthz`);
    const healthTime = Date.now() - startTime;
    
    expect(healthResponse.status()).toBe(200);
    expect(healthTime).toBeLessThan(1000); // Should respond within 1 second
    
    // Test /readyz response time
    const readyStartTime = Date.now();
    const readyResponse = await page.request.fetch(`${apiClient.baseUrl}/readyz`);
    const readyTime = Date.now() - readyStartTime;
    
    expect([200, 503]).toContain(readyResponse.status());
    expect(readyTime).toBeLessThan(5000); // Should respond within 5 seconds
  });

  test('Health endpoints work without authentication', async ({ page }) => {
    // Test that health endpoints don't require authentication
    const healthResponse = await page.request.fetch(`${apiClient.baseUrl}/healthz`);
    const readyResponse = await page.request.fetch(`${apiClient.baseUrl}/readyz`);
    
    expect(healthResponse.status()).toBe(200);
    expect([200, 503]).toContain(readyResponse.status());
  });

  test('Health endpoint aliases work correctly', async ({ page }) => {
    // Test various health endpoint aliases
    const endpoints = ['/health', '/health/live'];
    
    for (const endpoint of endpoints) {
      const response = await page.request.fetch(`${apiClient.baseUrl}${endpoint}`);
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('status', 'ok');
    }
  });

  test('Readiness endpoint aliases work correctly', async ({ page }) => {
    // Test various readiness endpoint aliases
    const endpoints = ['/ready', '/health/ready'];
    
    for (const endpoint of endpoints) {
      const response = await page.request.fetch(`${apiClient.baseUrl}${endpoint}`);
      expect([200, 503]).toContain(response.status());
      
      const data = await response.json();
      expect(['ready', 'not_ready']).toContain(data.status);
    }
  });

  test('Health endpoints return consistent timestamps', async ({ page }) => {
    const response1 = await page.request.fetch(`${apiClient.baseUrl}/healthz`);
    const data1 = await response1.json();
    
    // Wait a small amount
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const response2 = await page.request.fetch(`${apiClient.baseUrl}/healthz`);
    const data2 = await response2.json();
    
    // Timestamps should be different (indicating fresh responses)
    expect(data1.timestamp).not.toBe(data2.timestamp);
    
    // Both should be valid timestamps
    expect(new Date(data1.timestamp)).toBeInstanceOf(Date);
    expect(new Date(data2.timestamp)).toBeInstanceOf(Date);
  });

  test('Health endpoints handle high load', async ({ page }) => {
    // Make multiple concurrent requests
    const promises = Array.from({ length: 10 }, () => 
      page.request.fetch(`${apiClient.baseUrl}/healthz`)
    );
    
    const responses = await Promise.all(promises);
    
    // All should succeed
    responses.forEach(response => {
      expect(response.status()).toBe(200);
    });
  });

  test('Readiness endpoint shows database dependency', async ({ page }) => {
    const response = await page.request.fetch(`${apiClient.baseUrl}/readyz`);
    const data = await response.json();
    
    expect(data.dependencies).toHaveProperty('database');
    
    const dbDep = data.dependencies.database;
    expect(dbDep).toHaveProperty('component');
    expect(dbDep).toHaveProperty('status');
    expect(dbDep.component).toBe('postgresql');
  });

  test('Readiness endpoint shows configuration dependency', async ({ page }) => {
    const response = await page.request.fetch(`${apiClient.baseUrl}/readyz`);
    const data = await response.json();
    
    expect(data.dependencies).toHaveProperty('configuration');
    
    const configDep = data.dependencies.configuration;
    expect(configDep).toHaveProperty('component', 'configuration');
    expect(configDep).toHaveProperty('status');
  });

  test('Health endpoints are accessible via different HTTP methods', async ({ page }) => {
    // Health endpoints should only respond to GET requests
    const getResponse = await page.request.fetch(`${apiClient.baseUrl}/healthz`, {
      method: 'GET'
    });
    expect(getResponse.status()).toBe(200);
    
    // POST should not be allowed
    const postResponse = await page.request.fetch(`${apiClient.baseUrl}/healthz`, {
      method: 'POST'
    });
    expect(postResponse.status()).toBe(405); // Method Not Allowed
  });
});