# SalesPulse AI - API Specifications v1

All API requests route prefix is `/api/v1`.

## Auth Endpoints
- `POST /auth/register`: Create user account.
- `POST /auth/token`: Retrieve access token and refresh token.
- `POST /auth/refresh`: Rotate tokens using a valid refresh token.

## Sales Data Endpoints
- `POST /sales/upload`: Upload CSV/Excel sales records.
- `GET /sales/transactions`: List paginated transactions.

## Analytics Endpoints
- `GET /analytics/kpis`: General dashboard metrics.
- `GET /analytics/forecasting`: Time-series sales forecasts.
