package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"your-project/internal/handlers"
)

// SetupHealthRoutes configures health and readiness endpoints
// RepoKIT Standard: Every service must expose /healthz and /readyz endpoints
func SetupHealthRoutes(router *gin.Engine, db *sql.DB, redis interface{}) {
	healthHandler := handlers.NewHealthHandler(db, redis)

	// Health endpoint - always returns 200 OK if process is alive
	router.GET("/healthz", healthHandler.Healthz)

	// Readiness endpoint - checks dependencies, returns 200 if ready, 503 if not
	router.GET("/readyz", healthHandler.Readyz)

	// Additional health endpoints for monitoring
	router.GET("/health", healthHandler.Healthz)     // Alias for /healthz
	router.GET("/ready", healthHandler.Readyz)       // Alias for /readyz
	router.GET("/health/live", healthHandler.Healthz) // Kubernetes liveness
	router.GET("/health/ready", healthHandler.Readyz) // Kubernetes readiness
}