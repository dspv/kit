/**
 * Health Indicator Component
 * RepoKIT Standard: Visual health status indicator for monitoring
 */

import React, { useEffect, useState } from 'react';
import { healthService, HealthStatus, ReadinessStatus } from '../services/health';

interface HealthIndicatorProps {
  showDetails?: boolean;
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  autoHide?: boolean;
}

export const HealthIndicator: React.FC<HealthIndicatorProps> = ({
  showDetails = false,
  className = '',
  position = 'bottom-right',
  autoHide = true
}) => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [readiness, setReadiness] = useState<ReadinessStatus | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(!autoHide);

  useEffect(() => {
    // Initial checks
    checkStatus();

    // Start monitoring
    const stopMonitoring = healthService.startHealthMonitoring(
      (healthStatus) => {
        setHealth(healthStatus);
        if (autoHide && healthStatus.status === 'ok') {
          setIsVisible(false);
        } else if (healthStatus.status === 'error') {
          setIsVisible(true);
        }
      },
      (readinessStatus) => {
        setReadiness(readinessStatus);
        if (autoHide && readinessStatus.status === 'ready') {
          setIsVisible(false);
        } else if (readinessStatus.status === 'not_ready') {
          setIsVisible(true);
        }
      },
      15000 // Check every 15 seconds
    );

    return () => {
      stopMonitoring();
    };
  }, [autoHide]);

  const checkStatus = async () => {
    try {
      const [healthStatus, readinessStatus] = await Promise.all([
        healthService.checkHealth(),
        healthService.checkReadiness()
      ]);
      setHealth(healthStatus);
      setReadiness(readinessStatus);
    } catch (error) {
      console.error('Failed to check service status:', error);
      setIsVisible(true);
    }
  };

  const getStatusColor = () => {
    if (!health || !readiness) return 'bg-gray-500';
    
    if (health.status === 'error') return 'bg-red-500';
    if (readiness.status === 'not_ready') return 'bg-yellow-500';
    if (health.status === 'ok' && readiness.status === 'ready') return 'bg-green-500';
    
    return 'bg-gray-500';
  };

  const getStatusText = () => {
    if (!health || !readiness) return 'Checking...';
    
    if (health.status === 'error') return 'Service Down';
    if (readiness.status === 'not_ready') return 'Service Starting';
    if (health.status === 'ok' && readiness.status === 'ready') return 'Service Healthy';
    
    return 'Unknown Status';
  };

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  if (!isVisible && autoHide && health?.status === 'ok' && readiness?.status === 'ready') {
    return null;
  }

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 ${className}`}
      data-testid="health-indicator"
    >
      <div className="bg-white rounded-lg shadow-lg border">
        {/* Status Indicator */}
        <div
          className="flex items-center p-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          data-testid="health-indicator-toggle"
        >
          <div
            className={`w-3 h-3 rounded-full ${getStatusColor()} mr-2 animate-pulse`}
            data-testid="health-status-dot"
          />
          <span className="text-sm font-medium text-gray-700">
            {getStatusText()}
          </span>
          {showDetails && (
            <svg
              className={`w-4 h-4 ml-2 transform transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </div>

        {/* Detailed Status */}
        {showDetails && isExpanded && (
          <div className="border-t px-3 py-2" data-testid="health-details">
            <div className="space-y-2">
              {/* Health Status */}
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Health:</span>
                <span className={health?.status === 'ok' ? 'text-green-600' : 'text-red-600'}>
                  {health?.status || 'unknown'}
                </span>
              </div>

              {/* Readiness Status */}
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Readiness:</span>
                <span className={readiness?.status === 'ready' ? 'text-green-600' : 'text-yellow-600'}>
                  {readiness?.status || 'unknown'}
                </span>
              </div>

              {/* Service Info */}
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Service:</span>
                <span className="text-gray-700">
                  {health?.service || readiness?.service || 'unknown'}
                </span>
              </div>

              {/* Last Updated */}
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Updated:</span>
                <span className="text-gray-700">
                  {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : 'never'}
                </span>
              </div>

              {/* Dependencies Status */}
              {readiness?.dependencies && (
                <div className="mt-2 pt-2 border-t">
                  <div className="text-xs text-gray-500 mb-1">Dependencies:</div>
                  {Object.entries(readiness.dependencies).map(([key, dep]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-gray-500">{dep.component}:</span>
                      <span className={dep.status === 'healthy' ? 'text-green-600' : 'text-red-600'}>
                        {dep.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="mt-2 pt-2 border-t flex space-x-2">
                <button
                  onClick={checkStatus}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  data-testid="refresh-health-status"
                >
                  Refresh
                </button>
                {autoHide && (
                  <button
                    onClick={() => setIsVisible(false)}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    data-testid="hide-health-indicator"
                  >
                    Hide
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Hook for using health status in components
export const useHealthStatus = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [readiness, setReadiness] = useState<ReadinessStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const [healthStatus, readinessStatus] = await Promise.all([
          healthService.checkHealth(),
          healthService.checkReadiness()
        ]);
        setHealth(healthStatus);
        setReadiness(readinessStatus);
      } catch (error) {
        console.error('Failed to check service status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();

    const stopMonitoring = healthService.startHealthMonitoring(
      setHealth,
      setReadiness,
      30000
    );

    return stopMonitoring;
  }, []);

  return {
    health,
    readiness,
    isLoading,
    isHealthy: health?.status === 'ok',
    isReady: readiness?.status === 'ready',
    refresh: async () => {
      setIsLoading(true);
      try {
        const [healthStatus, readinessStatus] = await Promise.all([
          healthService.checkHealth(),
          healthService.checkReadiness()
        ]);
        setHealth(healthStatus);
        setReadiness(readinessStatus);
      } catch (error) {
        console.error('Failed to refresh status:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
};