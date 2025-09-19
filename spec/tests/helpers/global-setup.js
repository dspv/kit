/**
 * Global Test Setup - RepoKIT Standards
 * Prepares test environment and verifies health endpoints
 */

const { chromium } = require('@playwright/test');
const { ApiClient } = require('./api-client');

async function globalSetup() {
  console.log('🔧 Setting up test environment...');

  // Launch browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const apiClient = new ApiClient(page);

  try {
    // Wait for services to be ready
    console.log('⏳ Waiting for services to be ready...');
    await waitForServices(apiClient);

    // Verify health endpoints (RepoKIT requirement)
    console.log('🩺 Verifying health endpoints...');
    await verifyHealthEndpoints(apiClient);

    // Setup test database
    console.log('🗄️ Setting up test database...');
    await setupTestDatabase(apiClient);

    // Create test data fixtures
    console.log('📊 Creating test data fixtures...');
    await createTestFixtures(apiClient);

    console.log('✅ Test environment setup completed');

  } catch (error) {
    console.error('❌ Test environment setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function waitForServices(apiClient, maxWaitTime = 60000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    try {
      // Check API health
      const health = await apiClient.healthCheck();
      if (health.ok) {
        console.log('✅ API service is healthy');
        return;
      }
    } catch (error) {
      // Service not ready yet, continue waiting
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  throw new Error('Services did not become ready within the specified time');
}

async function verifyHealthEndpoints(apiClient) {
  // RepoKIT Standard: Verify /healthz endpoint
  try {
    const health = await apiClient.healthCheck();
    if (!health.ok || health.status !== 200) {
      throw new Error(`/healthz endpoint failed: ${health.status}`);
    }
    console.log('✅ /healthz endpoint verified');
  } catch (error) {
    throw new Error(`Health endpoint verification failed: ${error.message}`);
  }

  // RepoKIT Standard: Verify /readyz endpoint
  try {
    const readiness = await apiClient.readinessCheck();
    if (readiness.status !== 200 && readiness.status !== 503) {
      throw new Error(`/readyz endpoint returned unexpected status: ${readiness.status}`);
    }
    console.log('✅ /readyz endpoint verified');
    
    if (readiness.status === 503) {
      console.log('⚠️ Service is not ready - some dependencies may be unavailable');
    }
  } catch (error) {
    console.warn(`⚠️ Readiness endpoint check failed: ${error.message}`);
    // Don't fail setup for readiness issues, just warn
  }
}

async function setupTestDatabase(apiClient) {
  try {
    // Clear existing test data
    await apiClient.clearDatabase();
    console.log('✅ Test database cleared');
  } catch (error) {
    console.warn('⚠️ Database clear failed (may not be implemented):', error.message);
  }
}

async function createTestFixtures(apiClient) {
  const { createSeederData } = require('./fixtures');
  
  try {
    // Generate comprehensive test data
    const seedData = createSeederData();
    
    // Seed the database
    await apiClient.seedDatabase(seedData);
    console.log('✅ Test fixtures created');
    
    // Store fixture data for tests
    global.testFixtures = seedData;
    
  } catch (error) {
    console.warn('⚠️ Test fixtures creation failed (may not be implemented):', error.message);
    // Create minimal fixtures for basic tests
    global.testFixtures = {
      users: [],
      companies: [],
      jobs: [],
      contacts: [],
      drafts: []
    };
  }
}

module.exports = globalSetup;