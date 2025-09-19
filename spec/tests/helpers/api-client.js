/**
 * API Client for Tests
 * RepoKIT Standard: Centralized API interaction for test setup
 */

class ApiClient {
  constructor(page) {
    this.page = page;
    this.baseUrl = process.env.API_BASE_URL || 'http://localhost:3001/api';
    this.authToken = null;
  }

  /**
   * Set authentication token
   */
  setAuthToken(token) {
    this.authToken = token;
  }

  /**
   * Make authenticated API request
   */
  async request(method, endpoint, data = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    const options = {
      method,
      headers,
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    const response = await this.page.request.fetch(url, options);
    
    if (!response.ok()) {
      const error = await response.text();
      throw new Error(`API request failed: ${response.status()} - ${error}`);
    }

    return response.json();
  }

  /**
   * Authentication methods
   */
  async createUser(userData) {
    const response = await this.request('POST', '/auth/register', userData);
    return response.data;
  }

  async login(credentials) {
    const response = await this.request('POST', '/auth/login', {
      email: credentials.email,
      password: credentials.password
    });
    
    if (response.data && response.data.token) {
      this.setAuthToken(response.data.token);
    }
    
    return response.data;
  }

  async logout() {
    await this.request('POST', '/auth/logout');
    this.authToken = null;
  }

  /**
   * Company methods
   */
  async createCompany(companyData) {
    const response = await this.request('POST', '/companies', companyData);
    return response.data;
  }

  async getCompany(companyId) {
    const response = await this.request('GET', `/companies/${companyId}`);
    return response.data;
  }

  async updateCompany(companyId, updates) {
    const response = await this.request('PUT', `/companies/${companyId}`, updates);
    return response.data;
  }

  async deleteCompany(companyId) {
    await this.request('DELETE', `/companies/${companyId}`);
  }

  async getCompanies(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/companies?${queryParams}` : '/companies';
    const response = await this.request('GET', endpoint);
    return response.data;
  }

  async bulkUpdateCompanies(companyIds, updates) {
    const response = await this.request('PATCH', '/companies/bulk', {
      ids: companyIds,
      updates
    });
    return response.data;
  }

  /**
   * Draft methods
   */
  async createDraft(draftData) {
    const response = await this.request('POST', '/drafts', draftData);
    return response.data;
  }

  async getDraft(draftId) {
    const response = await this.request('GET', `/drafts/${draftId}`);
    return response.data;
  }

  async updateDraft(draftId, updates) {
    const response = await this.request('PUT', `/drafts/${draftId}`, updates);
    return response.data;
  }

  async deleteDraft(draftId) {
    await this.request('DELETE', `/drafts/${draftId}`);
  }

  async sendDraft(draftId) {
    const response = await this.request('POST', `/drafts/${draftId}/send`);
    return response.data;
  }

  async previewDraft(draftId) {
    const response = await this.request('GET', `/drafts/${draftId}/preview`);
    return response.data;
  }

  /**
   * Job methods
   */
  async createJob(jobData) {
    const response = await this.request('POST', '/jobs', jobData);
    return response.data;
  }

  async getJob(jobId) {
    const response = await this.request('GET', `/jobs/${jobId}`);
    return response.data;
  }

  async getJobsByCompany(companyId) {
    const response = await this.request('GET', `/companies/${companyId}/jobs`);
    return response.data;
  }

  /**
   * Contact methods
   */
  async createContact(contactData) {
    const response = await this.request('POST', '/contacts', contactData);
    return response.data;
  }

  async getContact(contactId) {
    const response = await this.request('GET', `/contacts/${contactId}`);
    return response.data;
  }

  async getContactsByCompany(companyId) {
    const response = await this.request('GET', `/companies/${companyId}/contacts`);
    return response.data;
  }

  /**
   * Upload methods
   */
  async uploadCSV(file, source = 'custom') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('source', source);

    const response = await this.page.request.fetch(`${this.baseUrl}/upload/csv`, {
      method: 'POST',
      headers: {
        'Authorization': this.authToken ? `Bearer ${this.authToken}` : undefined
      },
      multipart: formData
    });

    if (!response.ok()) {
      throw new Error(`Upload failed: ${response.status()}`);
    }

    return response.json();
  }

  async getUploadHistory() {
    const response = await this.request('GET', '/upload/history');
    return response.data;
  }

  /**
   * Health check methods
   */
  async healthCheck() {
    const response = await this.page.request.fetch(`${this.baseUrl}/healthz`);
    return {
      status: response.status(),
      ok: response.ok()
    };
  }

  async readinessCheck() {
    const response = await this.page.request.fetch(`${this.baseUrl}/readyz`);
    return {
      status: response.status(),
      ok: response.ok(),
      data: response.ok() ? await response.json() : null
    };
  }

  /**
   * Database seeding for tests
   */
  async seedDatabase(seedData) {
    const response = await this.request('POST', '/test/seed', seedData);
    return response.data;
  }

  async clearDatabase() {
    await this.request('DELETE', '/test/clear');
  }

  /**
   * Test utilities
   */
  async waitForProcessing(operationId, maxWaitTime = 30000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      const response = await this.request('GET', `/operations/${operationId}/status`);
      
      if (response.data.status === 'completed') {
        return response.data;
      }
      
      if (response.data.status === 'failed') {
        throw new Error(`Operation failed: ${response.data.error}`);
      }
      
      // Wait 1 second before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error('Operation timed out');
  }

  /**
   * Error handling helper
   */
  async expectApiError(apiCall, expectedStatus) {
    try {
      await apiCall();
      throw new Error('Expected API call to fail but it succeeded');
    } catch (error) {
      if (!error.message.includes(expectedStatus.toString())) {
        throw new Error(`Expected status ${expectedStatus} but got: ${error.message}`);
      }
    }
  }
}

module.exports = { ApiClient };