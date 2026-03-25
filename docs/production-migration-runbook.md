# ABTF Production Migration Runbook

This project uses Prisma Migrate only for production schema changes.
Do not use `prisma db push` against production.

## Why P3005 happens

If production already has tables but Prisma migration history is missing, `prisma migrate deploy` can fail with:

- `P3005: The database schema is not empty.`

Fix is to baseline the existing DB once by marking the baseline migration as applied.

## One-time onboarding for an existing non-empty production DB

Run this once if production existed before Prisma Migrate history:

1. Backup the database.
2. Mark baseline as already applied:

```bash
npx prisma migrate resolve --applied 20260323000100_baseline_existing_db
```

3. Then run normal migration deploy:

```bash
npm run prisma:migrate:deploy
```

## Remote deployment using provided scripts

The deployment wrapper now checks migration state before `migrate deploy`.

- If baseline is already recorded, deploy continues normally.
- If DB is empty, baseline is applied naturally through `migrate deploy`.
- If DB is non-empty and baseline is missing, deploy now auto-marks baseline as applied safely, then continues.

Auto-baseline behavior is controlled by:

- `PRISMA_AUTO_BASELINE_ON_EXISTING_DB=true` (default)

- Normal deploy:

```bash
bash scripts/deploy.sh
```

- One-time guarded baseline mode + deploy:

```bash
PRISMA_BASELINE_ON_EXISTING_DB=true bash scripts/deploy.sh
```

- Disable auto-baseline (strict fail-fast mode):

```bash
PRISMA_AUTO_BASELINE_ON_EXISTING_DB=false bash scripts/deploy.sh
```

This executes on the remote server in this order:

1. install dependencies
2. `prisma generate`
3. detect migration state and baseline entry
4. optional auto-baseline resolve for non-empty DBs without baseline history
5. `prisma migrate deploy`
6. build
7. prune devDependencies for runtime
8. PM2 restart

If any critical step fails, deployment stops and PM2 restart is not run.

## Recovery if `migrate deploy` fails later

If a future migration fails after baseline is already recorded:

1. Do not run `prisma migrate reset` on production.
2. Read the failing migration and Prisma error output.
3. Fix forward with a new migration (preferred), or manually reconcile SQL if required by incident response.
4. Re-run normal deploy once the schema/data inconsistency is resolved.
5. Keep a fresh DB backup before any manual reconciliation.
