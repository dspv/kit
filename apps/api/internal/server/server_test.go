package server_test

import (
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"api/internal/server"
)

// helper to restore env vars after test
func withEnv(t *testing.T, key, value string) {
	prev, had := os.LookupEnv(key)
	if value == "" {
		_ = os.Unsetenv(key)
	} else {
		_ = os.Setenv(key, value)
	}
	t.Cleanup(func() {
		if had {
			_ = os.Setenv(key, prev)
		} else {
			_ = os.Unsetenv(key)
		}
	})
}

func TestHealthzAlways200(t *testing.T) {
	mux := server.NewMux()
	ts := httptest.NewServer(mux)
	defer ts.Close()

	resp, err := http.Get(ts.URL + "/healthz")
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}
}

func TestReadyz_NoConfig_IsReady(t *testing.T) {
	withEnv(t, "READY_REQUIRE_ENV", "")
	withEnv(t, "READY_HTTP_ENDPOINTS", "")
	withEnv(t, "READY_TCP_ENDPOINTS", "")
	withEnv(t, "READY_MIN_UPTIME_SECS", "")

	mux := server.NewMux()
	ts := httptest.NewServer(mux)
	defer ts.Close()

	resp, err := http.Get(ts.URL + "/readyz")
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}
}

func TestReadyz_RequiredEnv_FailsWhenMissing(t *testing.T) {
	withEnv(t, "READY_REQUIRE_ENV", "FOO")
	withEnv(t, "FOO", "") // missing

	mux := server.NewMux()
	ts := httptest.NewServer(mux)
	defer ts.Close()

	resp, err := http.Get(ts.URL + "/readyz")
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusServiceUnavailable {
		t.Fatalf("expected 503, got %d", resp.StatusCode)
	}
}

func TestReadyz_RequiredEnv_PassesWhenPresent(t *testing.T) {
	withEnv(t, "READY_REQUIRE_ENV", "FOO")
	withEnv(t, "FOO", "bar")

	mux := server.NewMux()
	ts := httptest.NewServer(mux)
	defer ts.Close()

	resp, err := http.Get(ts.URL + "/readyz")
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}
}

func TestReadyz_MultipleEnv(t *testing.T) {
	withEnv(t, "READY_REQUIRE_ENV", "FOO,BAR")
	withEnv(t, "FOO", "foo")
	withEnv(t, "BAR", "") // missing

	mux := server.NewMux()
	ts := httptest.NewServer(mux)
	defer ts.Close()

	resp, err := http.Get(ts.URL + "/readyz")
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusServiceUnavailable {
		t.Fatalf("expected 503, got %d", resp.StatusCode)
	}

	// Now satisfy BAR
	withEnv(t, "BAR", "bar")
	resp2, err := http.Get(ts.URL + "/readyz")
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp2.Body.Close()
	if resp2.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp2.StatusCode)
	}
}

