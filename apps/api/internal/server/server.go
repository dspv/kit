package server

import (
	"context"
	"encoding/json"
	"errors"
	"net"
	"net/http"
	"os"
	"strings"
	"time"
)

var appStartTime = time.Now()

// NewMux builds the HTTP handler with health and readiness endpoints.
func NewMux() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]any{
			"status":  "ok",
			"uptimeS": int(time.Since(appStartTime).Seconds()),
		})
	})

	mux.HandleFunc("/readyz", func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(r.Context(), readTimeout())
		defer cancel()

		ready, details := checkReadiness(ctx)
		code := http.StatusOK
		status := "ready"
		if !ready {
			code = http.StatusServiceUnavailable
			status = "not_ready"
		}
		writeJSON(w, code, map[string]any{
			"status":  status,
			"checks":  details,
			"uptimeS": int(time.Since(appStartTime).Seconds()),
		})
	})

	return mux
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

// checkReadiness evaluates configured dependencies and returns overall readiness and details.
// Configuration via environment variables:
// - READY_REQUIRE_ENV: comma-separated list of env var names that must be set (non-empty)
// - READY_HTTP_ENDPOINTS: comma-separated list of HTTP/HTTPS URLs to check with HEAD (2xx considered healthy)
// - READY_TCP_ENDPOINTS: comma-separated list of host:port endpoints to check with TCP dial
// - READY_MIN_UPTIME_SECS: optional warmup period before reporting ready
// - READY_TIMEOUT_MS: per-check timeout in milliseconds (default 300)
func checkReadiness(ctx context.Context) (bool, map[string]map[string]string) {
	results := map[string]map[string]string{
		"env":  {},
		"http": {},
		"tcp":  {},
	}

	overallReady := true

	// Warmup requirement
	if minUptime := getEnvInt("READY_MIN_UPTIME_SECS", 0); minUptime > 0 {
		if int(time.Since(appStartTime).Seconds()) < minUptime {
			overallReady = false
			results["env"]["READY_MIN_UPTIME_SECS"] = "warming_up"
		}
	}

	// Required env vars
	reqEnv := splitAndTrim(os.Getenv("READY_REQUIRE_ENV"))
	for _, name := range reqEnv {
		if val, ok := os.LookupEnv(name); ok && strings.TrimSpace(val) != "" {
			results["env"][name] = "ok"
		} else {
			results["env"][name] = "missing"
			overallReady = false
		}
	}

	// HTTP endpoints
	httpEndpoints := splitAndTrim(os.Getenv("READY_HTTP_ENDPOINTS"))
	for _, u := range httpEndpoints {
		if err := checkHTTP(ctx, u); err != nil {
			results["http"][u] = "fail: " + err.Error()
			overallReady = false
		} else {
			results["http"][u] = "ok"
		}
	}

	// TCP endpoints
	tcpEndpoints := splitAndTrim(os.Getenv("READY_TCP_ENDPOINTS"))
	for _, addr := range tcpEndpoints {
		if err := checkTCP(ctx, addr); err != nil {
			results["tcp"][addr] = "fail: " + err.Error()
			overallReady = false
		} else {
			results["tcp"][addr] = "ok"
		}
	}

	// If no checks configured at all, consider ready (no critical dependencies declared)
	if len(reqEnv) == 0 && len(httpEndpoints) == 0 && len(tcpEndpoints) == 0 && getEnvInt("READY_MIN_UPTIME_SECS", 0) == 0 {
		overallReady = true
	}

	return overallReady, results
}

func splitAndTrim(s string) []string {
	if strings.TrimSpace(s) == "" {
		return nil
	}
	parts := strings.Split(s, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		p = strings.TrimSpace(p)
		if p != "" {
			out = append(out, p)
		}
	}
	return out
}

func readTimeout() time.Duration {
	ms := getEnvInt("READY_TIMEOUT_MS", 300)
	return time.Duration(ms) * time.Millisecond
}

func getEnvInt(name string, def int) int {
	val := strings.TrimSpace(os.Getenv(name))
	if val == "" {
		return def
	}
	// minimal parse that never panics
	var n int
	for _, ch := range val {
		if ch < '0' || ch > '9' {
			return def
		}
		n = n*10 + int(ch-'0')
	}
	return n
}

func checkHTTP(ctx context.Context, url string) error {
	client := &http.Client{Timeout: readTimeout()}
	req, err := http.NewRequestWithContext(ctx, http.MethodHead, url, nil)
	if err != nil {
		return err
	}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return errors.New(resp.Status)
	}
	return nil
}

func checkTCP(ctx context.Context, addr string) error {
	d := net.Dialer{Timeout: readTimeout()}
	conn, err := d.DialContext(ctx, "tcp", addr)
	if err != nil {
		return err
	}
	_ = conn.Close()
	return nil
}

