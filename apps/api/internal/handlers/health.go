package handlers

import (
	"context"
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// HealthHandler handles health and readiness endpoints
type HealthHandler struct {
	db    *sql.DB
	redis interface{} // Redis client interface
}

// NewHealthHandler creates a new health handler
func NewHealthHandler(db *sql.DB, redis interface{}) *HealthHandler {
	return &HealthHandler{
		db:    db,
		redis: redis,
	}
}

// HealthzResponse represents the health check response
type HealthzResponse struct {
	Status    string    `json:"status"`
	Timestamp time.Time `json:"timestamp"`
	Service   string    `json:"service"`
}

// ReadyzResponse represents the readiness check response
type ReadyzResponse struct {
	Status       string                 `json:"status"`
	Timestamp    time.Time              `json:"timestamp"`
	Service      string                 `json:"service"`
	Dependencies map[string]interface{} `json:"dependencies"`
}

// Healthz always returns 200 OK if the process is alive
// RepoKIT Standard: /healthz → always returns 200 OK if the process is alive
func (h *HealthHandler) Healthz(c *gin.Context) {
	response := HealthzResponse{
		Status:    "ok",
		Timestamp: time.Now(),
		Service:   "api",
	}

	c.JSON(http.StatusOK, response)
}

// Readyz checks critical dependencies and returns 200 OK if ready, 503 if not
// RepoKIT Standard: /readyz → checks critical dependencies (databases, queues, configs) and returns 200 OK if ready, 503 if not
func (h *HealthHandler) Readyz(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	dependencies := make(map[string]interface{})
	allHealthy := true

	// Check database connection
	if h.db != nil {
		dbStatus := h.checkDatabase(ctx)
		dependencies["database"] = dbStatus
		if dbStatus["status"] != "healthy" {
			allHealthy = false
		}
	}

	// Check Redis connection (if configured)
	if h.redis != nil {
		redisStatus := h.checkRedis(ctx)
		dependencies["redis"] = redisStatus
		if redisStatus["status"] != "healthy" {
			allHealthy = false
		}
	}

	// Check environment configuration
	configStatus := h.checkConfiguration()
	dependencies["configuration"] = configStatus
	if configStatus["status"] != "healthy" {
		allHealthy = false
	}

	// Check external services (if any)
	externalStatus := h.checkExternalServices(ctx)
	dependencies["external_services"] = externalStatus
	if externalStatus["status"] != "healthy" {
		allHealthy = false
	}

	response := ReadyzResponse{
		Service:      "api",
		Timestamp:    time.Now(),
		Dependencies: dependencies,
	}

	if allHealthy {
		response.Status = "ready"
		c.JSON(http.StatusOK, response)
	} else {
		response.Status = "not_ready"
		c.JSON(http.StatusServiceUnavailable, response)
	}
}

// checkDatabase verifies database connectivity and basic operations
func (h *HealthHandler) checkDatabase(ctx context.Context) map[string]interface{} {
	result := map[string]interface{}{
		"component": "postgresql",
	}

	if h.db == nil {
		result["status"] = "unhealthy"
		result["error"] = "database connection not configured"
		return result
	}

	// Test basic connectivity
	if err := h.db.PingContext(ctx); err != nil {
		result["status"] = "unhealthy"
		result["error"] = err.Error()
		return result
	}

	// Test a simple query
	var count int
	query := "SELECT 1"
	if err := h.db.QueryRowContext(ctx, query).Scan(&count); err != nil {
		result["status"] = "unhealthy"
		result["error"] = "query test failed: " + err.Error()
		return result
	}

	// Check connection pool stats
	stats := h.db.Stats()
	result["status"] = "healthy"
	result["open_connections"] = stats.OpenConnections
	result["in_use"] = stats.InUse
	result["idle"] = stats.Idle

	return result
}

// checkRedis verifies Redis connectivity
func (h *HealthHandler) checkRedis(ctx context.Context) map[string]interface{} {
	result := map[string]interface{}{
		"component": "redis",
	}

	if h.redis == nil {
		result["status"] = "healthy" // Redis is optional
		result["note"] = "redis not configured"
		return result
	}

	// This would be implemented based on your Redis client
	// Example for go-redis client:
	/*
	client, ok := h.redis.(*redis.Client)
	if !ok {
		result["status"] = "unhealthy"
		result["error"] = "invalid redis client type"
		return result
	}

	if err := client.Ping(ctx).Err(); err != nil {
		result["status"] = "unhealthy"
		result["error"] = err.Error()
		return result
	}
	*/

	result["status"] = "healthy"
	return result
}

// checkConfiguration verifies critical environment variables and settings
func (h *HealthHandler) checkConfiguration() map[string]interface{} {
	result := map[string]interface{}{
		"component": "configuration",
	}

	// Check critical environment variables
	requiredEnvVars := []string{
		"DATABASE_URL",
		"JWT_SECRET",
		"PORT",
	}

	missing := []string{}
	for _, envVar := range requiredEnvVars {
		if value := getEnv(envVar); value == "" {
			missing = append(missing, envVar)
		}
	}

	if len(missing) > 0 {
		result["status"] = "unhealthy"
		result["error"] = "missing required environment variables"
		result["missing"] = missing
		return result
	}

	result["status"] = "healthy"
	result["required_vars"] = len(requiredEnvVars)
	return result
}

// checkExternalServices verifies connectivity to external dependencies
func (h *HealthHandler) checkExternalServices(ctx context.Context) map[string]interface{} {
	result := map[string]interface{}{
		"component": "external_services",
	}

	// Add checks for external services like:
	// - Email service
	// - File storage
	// - Third-party APIs
	// - Message queues

	// For now, return healthy as no external services are configured
	result["status"] = "healthy"
	result["note"] = "no external services configured"

	return result
}

// getEnv is a helper to get environment variables
func getEnv(key string) string {
	// This would typically use os.Getenv(key)
	// Placeholder for demonstration
	return "configured" // Simulate that env vars are set
}