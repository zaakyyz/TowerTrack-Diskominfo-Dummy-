# TowerTrack demo on Vercel Container

This is a separate Vercel project from the Next.js portfolio. The container
configuration is in `Dockerfile.vercel`, `Caddyfile.vercel`, and `vercel.json`.
Vercel's container runtime is currently beta and runs stateless instances.

## Before deploying

1. Provision a separate, externally hosted MySQL database for the demo.
   Do not connect the office database or import survey CSV files.
2. Keep `DEMO_DISABLE_UPLOADS=true`. The current `public` disk writes to local
   storage, which is temporary on Vercel. File uploads are rejected in this
   demo until an external object store is configured and the `/storage/` URL
   paths in the app are adapted to it.
3. Configure mail and a real Cloudflare Turnstile site for the demo domain
   before enabling public registration and submissions.

## Vercel project settings

Import `zaakyyz/TowerTrack-Diskominfo-Dummy-` as a **new** Vercel project.
Keep the portfolio as its existing project. The repository's `vercel.json`
uses a container service and sends all requests to it.

Set these environment variables in the TowerTrack project:

| Variable | Value |
| --- | --- |
| `APP_NAME` | `TowerTrack Demo` |
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_URL` | The final HTTPS URL |
| `APP_KEY` | One stable value from `php artisan key:generate --show` |
| `DEMO_MODE` | `true` |
| `DEMO_SEED_PASSWORD` | A strong private password; do not publish it |
| `DEMO_DISABLE_UPLOADS` | `true` on Vercel's stateless container |
| `DEMO_READY` | Leave `false` until setup is finished, then set `true` |
| `DB_CONNECTION` | `mysql` |
| `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | Credentials for the demo database |
| `SESSION_DRIVER`, `CACHE_STORE` | `database` after migrations |
| `SESSION_SECURE_COOKIE` | `true` |
| `QUEUE_CONNECTION` | `sync` for this single-container demo |
| `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Real keys for the demo hostname |

Do not upload `.env` to Vercel or store credentials in Git. Keep the database
region near the Vercel function region. The Docker image deliberately does
not run `php artisan config:cache`, because Vercel injects secrets at runtime.

## Database setup

After the database is reachable, run `php artisan migrate --force` and
`php artisan db:seed --force` once from a trusted environment configured with
the same demo environment variables. Use a **new empty database**: the seeder
deletes uploaded files and some seeders truncate tables. Do not run this on
an existing production database.

With `DEMO_MODE=true`, the tower and FO seeders create synthetic coordinates
even if survey CSV files exist. The seeder refuses to run without
`DEMO_SEED_PASSWORD`. Keep seeded account credentials private; they provide
write access to the admin interface. Public visitors can explore the map
without logging in.

## Final checks

- Open `/up`, `/`, `/data-tower`, and `/data-fo` on the Vercel URL.
- Confirm anonymous users cannot call FO mutation endpoints.
- Confirm no survey data, user uploads, or private credentials are present.
- Point `towertrack.zakyx.my.id` to the TowerTrack project, then update
  `APP_URL` and Turnstile hostnames to match and redeploy TowerTrack.
- Once that URL is healthy, set `NEXT_PUBLIC_TOWERTRACK_URL` in the
  **portfolio** Vercel project to it and redeploy the portfolio.

The Vercel image defaults to `DEMO_READY=false`, which shows a 503 preparation
message without starting a database-backed session. Keep it in that state
until the database is migrated and seeded, then set `DEMO_READY=true` in the
Vercel project and redeploy.

Reference: [Vercel's Laravel container guide](https://vercel.com/kb/guide/laravel-php-with-docker).
