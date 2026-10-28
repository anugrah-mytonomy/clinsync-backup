# DevOps Setup for ClinSync UI

This guide copies the DevOps setup from **pec-configurator-ui** (the Site Configurator) and adapts it to **clynsync** (`mytonomy/CFH-clinsync-ui`).

It covers:

1. What pec-configurator-ui does today
2. What clynsync already has and what is missing
3. The files to add to clynsync, ready to paste
4. The AWS and GitHub setup that has to exist outside the repo
5. A checklist

---

## 1. What pec-configurator-ui does today

### 1.1 Summary

| Area | How it works |
|---|---|
| Hosting | Static SPA on **S3**, served through **CloudFront** |
| CI/CD | **GitHub Actions**, two workflows: `CDNonProd.yml` and `CDProd.yml` |
| Trigger | Manual only (`on: workflow_dispatch`). There is no CI on push or PR. |
| AWS auth | **GitHub OIDC**, which assumes an IAM role. No AWS keys are stored in GitHub. |
| Quality gates | `npm ci` → `lint` → `typecheck` → `test:coverage` (coverage thresholds enforced) → build |
| Env config | `.env.stage` / `.env.production` are **committed**. The workflow copies one to `.env` before building. |
| Runtime overrides | `VITE_DISABLED_BACKEND_ENVS` can be overridden from a **GitHub repository variable** (`vars.*`) |
| Caching | Hashed assets: `max-age=31536000, immutable`. `index.html`: `no-cache`. Then a CloudFront `/*` invalidation. |
| Concurrency | `concurrency.group` per environment with `cancel-in-progress: true` |
| Local mirror | `scripts/bundle.sh` runs install → format → lint → build:stage |
| Reporting | Writes a Markdown deployment summary to `$GITHUB_STEP_SUMMARY` |

### 1.2 Environments

| Workflow | Branch (by convention) | AWS account / role | S3 bucket | Build command | Env file |
|---|---|---|---|---|---|
| `CDNonProd.yml` | `develop` | `480802442439` / `GithubOIDC-Dev` | `configurator-ui` | `npm run build:stage` | `.env.stage` |
| `CDProd.yml` | `release` | `900186033677` / `Github_Action_AssumeRole` | `prod-configurator-ui` | `npm run build:prod` | `.env.production` |

Region: `us-east-1`.

### 1.3 Pipeline steps (both workflows are identical apart from the values above)

1. `actions/checkout@v5`
2. `actions/setup-node@v4` with Node 20 and `cache: npm`
3. `npm ci`
4. `npm run lint`
5. `npm run typecheck` (`tsc -b`)
6. `npm run test:coverage` (Vitest with v8 coverage; thresholds statements 80 / branches 70 / functions 75 / lines 80)
7. Copy `.env.<mode>` to `.env`. The step fails if the file is missing.
8. `npm run build:<mode>`, with `VITE_DISABLED_BACKEND_ENVS` taken from `vars`
9. `aws-actions/configure-aws-credentials@v4` (OIDC role assume)
10. Detect the build directory (`dist` for Vite, `build` for CRA)
11. `aws s3 sync dist/ s3://<bucket> --delete --exclude index.html --cache-control "public, max-age=31536000, immutable"`
12. `aws s3 cp dist/index.html s3://<bucket>/index.html --cache-control no-cache`
13. `aws cloudfront create-invalidation --paths "/*"`
14. Write the deployment summary

### 1.4 Supporting repo config

- `package.json` scripts: `lint`, `format`, `format:check`, `typecheck`, `test`, `test:coverage`, `build:stage`, `build:prod`
- `vite.config.ts`:
  - Dev proxy for `/api_auth` and `/api_config`
  - Coverage thresholds
  - Test-mode env values
  - `manualChunks` that puts all `node_modules` code into one vendor chunk
- `.env.example`, which documents every `VITE_*` key
- `.gitignore`, which ignores `dist`, `coverage`, `*.local` and `*.tsbuildinfo`
- `.prettierrc` and `eslint.config.js` (flat config)

### 1.5 Problems in pec that you should not copy

| Problem | Why it matters | Fix used in this guide |
|---|---|---|
| The step says "Checkout develop/release branch explicitly", but there is no `ref:` or branch guard | Anyone can deploy **any** branch to prod from the "Run workflow" dropdown | Add a branch guard step |
| `cancel-in-progress: true` on prod | A second run can stop the first one in the middle of `s3 sync --delete`, which leaves the site half-deployed | `cancel-in-progress: false` |
| The prod role session name is `GitHubOIDC-React-Dev` | Makes CloudTrail audit logs misleading | Use a session name per environment |
| The coverage step is labelled "Type Check" | Cosmetic | Fixed |
| Real `.env.stage` / `.env.production` are committed | Fine for public `VITE_*` values, but clynsync deliberately **gitignores** them | Build env comes from GitHub Environment variables |
| No PR CI | Lint, typecheck and test only run at deploy time | Add a `ci.yml` that runs on PRs |

---

## 2. Status in clynsync

| Item | Status |
|---|---|
| `lint`, `format`, `format:check`, `typecheck`, `test`, `test:coverage`, `build:stage`, `build:prod` scripts | ✅ Already in `package.json` |
| Coverage thresholds in `vite.config.ts` (80/70/80/80) | ✅ Present |
| Dev proxy (`/api_auth`, `/api`) and prod direct URLs in `src/app/api/apiSlice.ts` | ✅ Same pattern as pec |
| `.env.example` | ✅ Present |
| Prettier and ESLint config | ✅ `.prettierrc.json`, `.prettierignore`, `eslint.config.js` |
| `.github/workflows/*` | ❌ The `.github` folder exists but contains no workflows |
| `scripts/bundle.sh` | ❌ Missing |
| `.env.stage` / `.env.production` in git | ⚠️ **Gitignored on purpose.** The pec `cp .env.stage .env` step will fail, so build env has to come from GitHub variables (see §3.2). |
| AWS S3 bucket, CloudFront distribution, OIDC IAM role | ❓ Need to be created or confirmed with DevOps (see §4) |
| `.gitignore` has `*.tsbuildinfo` | ❌ Missing. Add it: `tsc -b` writes these files. |

### 2.1 Build-time env vars that clynsync needs

Your local `.env.*` files also contain pec-only keys (`VITE_CONFIG_API_URL`, `VITE_BACKEND_ENVS_IN_ORDER`, `VITE_DISABLED_BACKEND_ENVS`, `VITE_SUPER_FUNCTION_CODE`, `VITE_REDOX_FUNCTION_CODE`). These look copied over and clynsync code does not read them. The production build only needs:

| Variable | Used in | Notes |
|---|---|---|
| `VITE_APP_ENV` | app | e.g. `stage` / `production` |
| `VITE_AUTH_API_URL` | `src/app/api/apiSlice.ts` | Full HTTPS URL. In prod builds it is called directly; there is no proxy. |
| `VITE_CLINSYNC_API_URL` | `src/app/api/apiSlice.ts` | Full HTTPS URL to the ClinSync API |

> `VITE_*` values are compiled into the public JS bundle. They are not secrets. Never put real secrets in a `VITE_*` variable.

---

## 3. Files to add to clynsync

### 3.1 `.github/workflows/ci.yml`: PR and push checks (new; pec does not have this)

```yaml
name: CI

on:
  pull_request:
    branches: [main, develop, release]
  push:
    branches: [main, develop, release]

permissions:
  contents: read

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install Dependencies
        run: npm ci

      - name: Format Check
        run: npm run format:check

      - name: Lint
        run: npm run lint

      - name: Type Check
        run: npm run typecheck

      - name: Run Tests (with coverage thresholds)
        run: npm run test:coverage

      - name: Upload coverage report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/
          retention-days: 7
```

### 3.2 `.github/workflows/CDNonProd.yml`: stage deploy

This differs from pec in one main way: env values come from **GitHub Environment variables** (`vars.*`) instead of a committed `.env.stage`. Vite gives `process.env` `VITE_*` values priority over `.env*` files, so setting them on the build step is enough.

```yaml
name: CD - Non Prod ClinSync UI S3 Deployment

on: workflow_dispatch

env:
  AWS_REGION: us-east-1
  AWS_ROLE_TO_ASSUME: arn:aws:iam::<NONPROD_ACCOUNT_ID>:role/<NONPROD_OIDC_ROLE>
  S3_BUCKET: <clinsync-ui-stage-bucket>
  CLOUDFRONT_DISTRIBUTION_ID: <STAGE_DISTRIBUTION_ID>
  ALLOWED_BRANCH: develop

permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy ClinSync UI (STAGE - develop branch)
    environment: stage # GitHub Environment holding the vars below

    concurrency:
      group: stage-deploy
      cancel-in-progress: false

    steps:
      # 1️⃣ Only allow the expected branch
      - name: Verify branch
        run: |
          if [ "${GITHUB_REF_NAME}" != "${ALLOWED_BRANCH}" ]; then
            echo "❌ This workflow can only deploy '${ALLOWED_BRANCH}' (got '${GITHUB_REF_NAME}')."
            exit 1
          fi

      # 2️⃣ Checkout
      - name: Checkout
        uses: actions/checkout@v5

      # 3️⃣ Setup Node
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      # 4️⃣ Install
      - name: Install Dependencies
        run: npm ci

      # 5️⃣ Lint
      - name: Lint
        run: npm run lint

      # 6️⃣ Type Check
      - name: Type Check
        run: npm run typecheck

      # 7️⃣ Tests
      - name: Run Tests
        run: npm run test:coverage

      # 8️⃣ Check that the required build vars are set
      - name: Validate build env
        env:
          VITE_AUTH_API_URL: ${{ vars.VITE_AUTH_API_URL }}
          VITE_CLINSYNC_API_URL: ${{ vars.VITE_CLINSYNC_API_URL }}
        run: |
          for v in VITE_AUTH_API_URL VITE_CLINSYNC_API_URL; do
            if [ -z "${!v}" ]; then
              echo "❌ Missing GitHub Environment variable: $v"
              exit 1
            fi
          done

      # 9️⃣ Build (build:stage already runs tsc -b)
      - name: Build
        env:
          VITE_APP_ENV: ${{ vars.VITE_APP_ENV || 'stage' }}
          VITE_AUTH_API_URL: ${{ vars.VITE_AUTH_API_URL }}
          VITE_CLINSYNC_API_URL: ${{ vars.VITE_CLINSYNC_API_URL }}
        run: npm run build:stage

      # 🔟 AWS credentials via OIDC
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ env.AWS_ROLE_TO_ASSUME }}
          role-session-name: GitHubOIDC-ClinSyncUI-Stage
          aws-region: ${{ env.AWS_REGION }}

      # 1️⃣1️⃣ Upload hashed static assets (long cache)
      - name: Deploy Static Assets
        run: |
          aws s3 sync dist/ s3://${{ env.S3_BUCKET }} \
            --delete \
            --exclude "index.html" \
            --cache-control "public, max-age=31536000, immutable"

      # 1️⃣2️⃣ Upload index.html (no cache, so users never get a stale UI)
      - name: Upload index.html
        run: |
          aws s3 cp dist/index.html s3://${{ env.S3_BUCKET }}/index.html \
            --cache-control "no-cache"

      # 1️⃣3️⃣ Invalidate CloudFront
      - name: Invalidate CloudFront Cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ env.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"

      # 1️⃣4️⃣ Summary
      - name: Deployment Summary
        if: success()
        run: |
          echo "## ✅ STAGE Deployment Successful" >> "$GITHUB_STEP_SUMMARY"
          echo "- **Branch:** ${GITHUB_REF_NAME}" >> "$GITHUB_STEP_SUMMARY"
          echo "- **Commit:** ${GITHUB_SHA}" >> "$GITHUB_STEP_SUMMARY"
          echo "- **Bucket:** $S3_BUCKET" >> "$GITHUB_STEP_SUMMARY"
          echo "- **CloudFront:** $CLOUDFRONT_DISTRIBUTION_ID" >> "$GITHUB_STEP_SUMMARY"
          echo "- **Triggered by:** ${{ github.actor }}" >> "$GITHUB_STEP_SUMMARY"
```

> clynsync is a Vite project, so the build output is always `dist/`. The workflow therefore drops pec's "Detect build directory (dist or build)" step.

### 3.3 `.github/workflows/CDProd.yml`: production deploy

This is the same file as §3.2 with these values changed:

| Field | Value |
|---|---|
| `name` | `CD - Prod ClinSync UI S3 Deployment` |
| `AWS_ROLE_TO_ASSUME` | `arn:aws:iam::<PROD_ACCOUNT_ID>:role/<PROD_OIDC_ROLE>` |
| `S3_BUCKET` | `<clinsync-ui-prod-bucket>` |
| `CLOUDFRONT_DISTRIBUTION_ID` | `<PROD_DISTRIBUTION_ID>` |
| `ALLOWED_BRANCH` | `release` |
| job `name` | `Deploy ClinSync UI (PROD - release branch)` |
| `environment` | `production` (add **required reviewers** to it in GitHub) |
| `concurrency.group` | `prod-deploy` (keep `cancel-in-progress: false`) |
| `VITE_APP_ENV` default | `'production'` |
| build command | `npm run build:prod` |
| `role-session-name` | `GitHubOIDC-ClinSyncUI-Prod` |
| Summary heading | `## ✅ PROD Deployment Successful` |

### 3.4 `scripts/bundle.sh`: run the CI steps locally

```bash
#!/usr/bin/env bash

set -euo pipefail

echo "🚀 Starting CI Pipeline..."

echo "📦 Installing dependencies..."
npm ci

echo "🎨 Checking formatting..."
npm run format:check

echo "🔍 Running ESLint..."
npm run lint

echo "🧠 Type checking..."
npm run typecheck

echo "🧪 Running tests with coverage..."
npm run test:coverage

echo "🏗️ Building project..."
npm run build:stage

echo "✅ Done"
```

Mark it as executable in git, because you are on Windows:

```bash
git add scripts/bundle.sh
git update-index --chmod=+x scripts/bundle.sh
```

> pec's version runs `npm run format`, which **rewrites** files. Here it is `format:check`, so the script matches CI and only reports problems.

### 3.5 Small repo changes

- **`.gitignore`**: add `*.tsbuildinfo`.
- **`.env.example`**: keep it limited to the keys clynsync reads (`VITE_APP_ENV`, `VITE_AUTH_API_URL`, `VITE_CLINSYNC_API_URL`).
- **Local `.env.*` files** (optional): remove the pec-only keys listed in §2.1.
- **`vite.config.ts`** (optional): to match pec, add a vendor chunk so app deploys don't invalidate the cached vendor bundle:
  ```ts
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
  ```

---

## 4. Setup outside the repo (AWS and GitHub)

pec's bucket, CloudFront distribution and IAM roles are **not** defined in the pec repo. Only their IDs appear in the workflows. They were created separately, so ask DevOps whether clynsync should reuse the same AWS accounts (`480802442439` non-prod, `900186033677` prod) and get the following created for each environment.

### 4.1 S3 bucket (one per environment)

- Block **all** public access. CloudFront reads the bucket through **Origin Access Control (OAC)**.
- Static website hosting is **not** needed when using OAC.
- The bucket policy allows `s3:GetObject` for the CloudFront service principal, scoped to the distribution ARN.

### 4.2 CloudFront distribution

- Origin: the S3 bucket via OAC
- Default root object: `index.html`
- **SPA routing (required for React Router):** add custom error responses
  - `403` → `/index.html`, response code `200`
  - `404` → `/index.html`, response code `200`
- Viewer protocol: redirect HTTP → HTTPS
- Alternate domain name and ACM certificate (the cert must be in `us-east-1`)
- The auth service sets cookies on `.mytonomy.com` (see `vite.config.ts`), so the UI domain should be under `mytonomy.com` for the refresh-token cookie to work.

### 4.3 IAM OIDC role for GitHub Actions

**Identity provider** (once per AWS account; it probably already exists because pec uses it):
`token.actions.githubusercontent.com`, audience `sts.amazonaws.com`

**Trust policy.** Scope it to the clynsync repo and to the GitHub Environment:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:mytonomy/CFH-clinsync-ui:environment:stage"
        }
      }
    }
  ]
}
```

For prod, use `...:environment:production`.

**Permissions policy** (least privilege):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::<BUCKET>"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::<BUCKET>/*"
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation"],
      "Resource": "arn:aws:cloudfront::<ACCOUNT_ID>:distribution/<DISTRIBUTION_ID>"
    }
  ]
}
```

> If DevOps would rather reuse pec's existing roles, the trust policy must be widened to include `repo:mytonomy/CFH-clinsync-ui:*` and the permissions policy must include the new bucket and distribution.

### 4.4 GitHub repository settings (`mytonomy/CFH-clinsync-ui`)

1. **Settings → Environments** → create `stage` and `production`.
2. In each environment, add the **Variables** (not Secrets):
   - `VITE_APP_ENV`
   - `VITE_AUTH_API_URL`
   - `VITE_CLINSYNC_API_URL`
3. `production` → **Required reviewers**: add the approvers. Optionally restrict deployment branches to `release`.
4. **Branch protection** on `main`/`develop`/`release`: require the `CI / verify` check to pass before merge.

### 4.5 Backend CORS

Prod builds call the APIs **directly**; there is no Vite proxy outside `npm run dev`. The auth and ClinSync APIs must therefore allow:

- **Origin:** the CloudFront/custom domain
- **Credentials:** `credentials: true` (the refresh-token cookie needs it)
- **Headers:** `Authorization`, `Content-Type`

---

## 5. Checklist

**Repo (clynsync)**

- [ ] Add `.github/workflows/ci.yml` (§3.1)
- [ ] Add `.github/workflows/CDNonProd.yml` (§3.2) and fill in the placeholders
- [ ] Add `.github/workflows/CDProd.yml` (§3.3) and fill in the placeholders
- [ ] Add `scripts/bundle.sh` (§3.4) and mark it executable
- [ ] Add `*.tsbuildinfo` to `.gitignore`
- [ ] Clean up `.env.example` and the local `.env.*` files (pec-only keys)
- [ ] Run `bash scripts/bundle.sh` locally and confirm it passes

**AWS (with DevOps)**

- [ ] S3 bucket for stage and for prod (private, OAC)
- [ ] CloudFront distribution for each, with the 403/404 → `/index.html` rule
- [ ] DNS and ACM certificate (`us-east-1`)
- [ ] OIDC IAM role for each, trusted for `repo:mytonomy/CFH-clinsync-ui:environment:<env>`
- [ ] Backend CORS allows the new UI origins with credentials

**GitHub**

- [ ] Environments `stage` and `production` with `VITE_*` variables
- [ ] Required reviewers on `production`
- [ ] Branch protection requires `CI / verify`

**First deploy**

- [ ] Actions → *CD - Non Prod* → Run workflow on `develop`
- [ ] Check the site loads, a deep link refresh works (SPA rewrite), and login and refresh work (cookies and CORS)
- [ ] Then *CD - Prod* on `release`
