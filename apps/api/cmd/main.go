package main

import (
	"log"
	"net/http"
	"os"

	"api/internal/server"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	handler := server.NewMux()
	addr := ":" + port
	log.Printf("API listening on %s", addr)
	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatalf("server error: %v", err)
	}
}

