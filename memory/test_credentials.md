# Utrerapp Test Credentials

## Admin Panel
- URL: `/admin`
- Password: `955863577`
- Endpoint: `POST /api/admin/login` body `{"password":"955863577"}` returns `{token}`.
- Use header `Authorization: Bearer <token>` for POST/DELETE on /traffic, /pharmacies, /theater, /events, /news, /anuncios (delete only).

## Chat (Conso)
- Endpoint: `POST /api/chat/stream` (SSE) body `{"session_id":"any","message":"..."}`
- No auth required.
- Reads EMERGENT_LLM_KEY from backend/.env (Claude Sonnet 4.6).
