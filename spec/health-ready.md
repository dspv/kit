# Health and Readiness Endpoints

## Summary

- Endpoint `/healthz`: Always returns 200 OK if process is alive.
- Endpoint `/readyz`: Returns 200 OK when critical dependencies are ready, 503 otherwise.

## Implementation (apps/api)

- `GET /healthz`
  - Response: `{ "status": "ok", "uptimeS": <int> }`

- `GET /readyz`
  - Response 200: `{ "status": "ready", "checks": {env|http|tcp}, "uptimeS": <int> }`
  - Response 503: `{ "status": "not_ready", ... }`
  - Readiness checks configured via environment variables:
    - `READY_REQUIRE_ENV`: comma-separated env var names that must be set (non-empty)
    - `READY_HTTP_ENDPOINTS`: comma-separated HTTP/HTTPS URLs to HEAD-check (2xx = ok)
    - `READY_TCP_ENDPOINTS`: comma-separated `host:port` TCP addresses to dial
    - `READY_MIN_UPTIME_SECS`: optional warmup period before reporting ready
    - `READY_TIMEOUT_MS`: per-check timeout in milliseconds (default: 300)

## Examples

```bash
# Require database URL and Redis URL
export READY_REQUIRE_ENV=DATABASE_URL,REDIS_URL

# Check Postgres and Redis TCP ports
export READY_TCP_ENDPOINTS=db:5432,redis:6379

# Give service 5 seconds warmup time
export READY_MIN_UPTIME_SECS=5
```

## Tests

- Location: `apps/api/internal/server/server_test.go`
- Coverage:
  - `/healthz` always 200
  - `/readyz` 200 when no checks configured
  - `/readyz` 503 when required env missing
  - `/readyz` 200 when required env present
  - Multiple envs handling

## Operational Notes

- Orchestrators should use `/readyz` for routing decisions.
- Keep env configuration in sync with actual dependencies.

