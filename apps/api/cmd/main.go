package main

import (
	"database/sql"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq" // PostgreSQL driver
	"your-project/internal/routes"
)

func main() {
	// Initialize database connection
	db, err := initDatabase()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Initialize Redis (optional)
	redis := initRedis()

	// Initialize Gin router
	router := gin.Default()

	// Setup CORS middleware
	router.Use(corsMiddleware())

	// Setup health routes (RepoKIT requirement)
	routes.SetupHealthRoutes(router, db, redis)

	// Setup API routes
	api := router.Group("/api/v1")
	{
		// Authentication routes
		// routes.SetupAuthRoutes(api, db)
		
		// Company routes
		// routes.SetupCompanyRoutes(api, db)
		
		// Draft routes
		// routes.SetupDraftRoutes(api, db)
		
		// Upload routes
		// routes.SetupUploadRoutes(api, db)
	}

	// Get port from environment or default to 3001
	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	log.Printf("Server starting on port %s", port)
	log.Printf("Health endpoints available at:")
	log.Printf("  GET /healthz - Liveness check")
	log.Printf("  GET /readyz  - Readiness check")

	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

// initDatabase initializes the PostgreSQL database connection
func initDatabase() (*sql.DB, error) {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		databaseURL = "postgres://user:password@localhost/dbname?sslmode=disable"
	}

	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		return nil, err
	}

	// Test the connection
	if err := db.Ping(); err != nil {
		return nil, err
	}

	// Configure connection pool
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)

	return db, nil
}

// initRedis initializes Redis connection (optional)
func initRedis() interface{} {
	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		log.Println("Redis not configured, skipping...")
		return nil
	}

	// Initialize Redis client here
	// Example with go-redis:
	/*
	rdb := redis.NewClient(&redis.Options{
		Addr: redisURL,
	})
	
	// Test connection
	ctx := context.Background()
	if err := rdb.Ping(ctx).Err(); err != nil {
		log.Printf("Redis connection failed: %v", err)
		return nil
	}
	
	return rdb
	*/

	return nil
}

// corsMiddleware adds CORS headers
func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}