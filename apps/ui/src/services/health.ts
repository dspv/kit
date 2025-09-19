/**
 * Health Service - Frontend health monitoring
 * RepoKIT Standard: Monitor backend health endpoints
 */

export interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  service: string;
}

export interface ReadinessStatus {
  status: 'ready' | 'not_ready';
  timestamp: string;
  service: string;
  dependencies: {
    [key: string]: {
      component: string;
      status: 'healthy' | 'unhealthy';
      error?: string;
      [key: string]: any;
    };
  };
}

export class HealthService {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') {
    this.baseUrl = baseUrl;
  }

  /**
   * Check if the backend service is alive
   * RepoKIT Standard: /healthz → always returns 200 OK if the process is alive
   */
  async checkHealth(): Promise<HealthStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/healthz`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  /**
   * Check if the backend service is ready to serve traffic
   * RepoKIT Standard: /readyz → checks critical dependencies and returns 200 OK if ready, 503 if not
   */
  async checkReadiness(): Promise<ReadinessStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/readyz`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Service is not ready, but we still want the response data
        return data;
      }

      return data;
    } catch (error) {
      console.error('Readiness check failed:', error);
      throw error;
    }
  }

  /**
   * Continuous health monitoring
   * Polls health endpoints at regular intervals
   */
  startHealthMonitoring(
    onHealthChange: (health: HealthStatus) => void,
    onReadinessChange: (readiness: ReadinessStatus) => void,
    interval: number = 30000 // 30 seconds
  ): () => void {
    let isRunning = true;

    const monitor = async () => {
      while (isRunning) {
        try {
          // Check health
          const health = await this.checkHealth();
          onHealthChange(health);

          // Check readiness
          const readiness = await this.checkReadiness();
          onReadinessChange(readiness);
        } catch (error) {
          // Handle monitoring errors
          onHealthChange({
            status: 'error',
            timestamp: new Date().toISOString(),
            service: 'unknown'
          });
        }

        // Wait for next interval
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    };

    // Start monitoring
    monitor();

    // Return stop function
    return () => {
      isRunning = false;
    };
  }

  /**
   * Get health status with timeout
   */
  async getHealthWithTimeout(timeout: number = 5000): Promise<HealthStatus> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseUrl}/healthz`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Health check timed out');
      }
      throw error;
    }
  }

  /**
   * Check if service is healthy (simple boolean check)
   */
  async isHealthy(): Promise<boolean> {
    try {
      const health = await this.checkHealth();
      return health.status === 'ok';
    } catch {
      return false;
    }
  }

  /**
   * Check if service is ready (simple boolean check)
   */
  async isReady(): Promise<boolean> {
    try {
      const readiness = await this.checkReadiness();
      return readiness.status === 'ready';
    } catch {
      return false;
    }
  }

  /**
   * Wait for service to be ready
   * Useful for initialization or deployment scenarios
   */
  async waitForReady(maxWaitTime: number = 60000, checkInterval: number = 2000): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      try {
        const isReady = await this.isReady();
        if (isReady) {
          return;
        }
      } catch {
        // Continue waiting
      }

      await new Promise(resolve => setTimeout(resolve, checkInterval));
    }

    throw new Error('Service did not become ready within the specified time');
  }
}

// Default instance
export const healthService = new HealthService();