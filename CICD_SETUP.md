# 🚀 CI/CD SETUP GUIDE - Complete Security & Quality Pipeline

## 📋 Overview

This CI/CD setup provides:

✅ **Local Development Checks** (pre-commit hooks)
- Secret detection (TruffleHog + detect-secrets)
- Code formatting (Prettier)
- Linting (ESLint)
- File validation

✅ **Server-Side CI/CD** (GitHub Actions)
- All local checks
- TypeScript compilation
- Build verification
- Dependency audits
- Automated reports

✅ **Security First**
- Blocks commits with secrets
- Prevents force-push with credentials
- Scans all branches
- Weekly automated scans

---

## 🔧 Installation

### For Single Repository

```bash
cd your-repo
bash ../ci-cd-templates/setup-cicd.sh
```

### For Multiple Repositories

```bash
for repo in hft_polymarket_bot polymarket_terminal LiqBot branch-buddy dual-clocks otodom; do
    cd /mnt/work/DEV/git_search/$repo
    bash ../ci-cd-templates/setup-cicd.sh
done
```

---

## 📁 What Gets Installed

### Files Created

```
your-repo/
├── .github/
│   └── workflows/
│       └── ci.yml ........................ GitHub Actions workflow
├── .eslintrc.json ....................... ESLint configuration
├── .prettierrc.json ..................... Prettier configuration
├── .prettierignore ....................... Prettier ignore rules
├── .pre-commit-config.yaml .............. Pre-commit hooks config
├── .secrets.baseline .................... Secrets detection baseline
└── SECURITY.md .......................... Security guidelines
```

### Dependencies Installed

**npm packages:**
- eslint
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser
- prettier
- eslint-plugin-react
- eslint-plugin-react-hooks

**Python packages:**
- pre-commit
- detect-secrets
- bandit (Python security)

---

## 🔐 Security Checks

### 1. Secret Detection (LOCAL)

**Tools:**
- TruffleHog: Scans for API keys, private keys, tokens
- detect-secrets: Prevents secrets from being committed

**Blocks commits if found:**
- API keys (AWS, Stripe, etc.)
- Private keys (*.pem, *.key)
- Database URLs
- Wallet seed phrases
- .env files

**Run manually:**
```bash
pre-commit run detect-secrets --all-files
truffleHog . --entropy True
```

### 2. Secret Detection (CI/CD)

**GitHub Actions runs:**
- TruffleHog on entire repo
- detect-secrets on changed files
- Blocks PR if secrets found

**View results:**
- Check "Actions" tab on GitHub
- Download "secrets-report" artifact

### 3. Code Quality (LOCAL)

**ESLint checks:**
- No unused variables
- No eval()
- No console.log in production
- React hooks rules
- Security best practices

**Run manually:**
```bash
npm run lint
npm run lint -- --fix  # Auto-fix
```

### 4. Code Formatting (LOCAL)

**Prettier enforces:**
- Consistent indentation (2 spaces)
- Single quotes
- No semicolon at end
- Consistent line endings

**Run manually:**
```bash
npm run format           # Format all files
npm run format:check    # Check only
```

---

## 🔄 Workflow

### Local Development

```bash
# 1. Make changes
echo "New feature" > src/feature.ts

# 2. Stage changes
git add src/feature.ts

# 3. Pre-commit hook runs AUTOMATICALLY
# - Checks for secrets ✓
# - Runs ESLint ✓
# - Formats with Prettier ✓
# - Validates files ✓

# If all pass:
git commit -m "feat: add new feature"
# ✅ Commit succeeds

# If any fail:
# ❌ Commit blocked (fix issues first)

# Fix issues:
npm run format
npm run lint -- --fix
pre-commit run --all-files

# Try again:
git commit -m "feat: add new feature"
```

### CI/CD Pipeline (GitHub)

```
Push to GitHub
    ↓
GitHub Actions triggered
    ↓
├─ Secret Scanning (TruffleHog)
├─ Detect-Secrets check
├─ ESLint & Prettier
├─ TypeScript check
├─ Build test
├─ Dependency audit
    ↓
All pass?
    ├─ YES → ✅ PR can merge
    └─ NO  → ❌ Block merge + notify
```

---

## ❌ What Gets Blocked

### Pre-commit Hook Blocks:

```bash
# ❌ Commit .env file
git add .env
git commit  # BLOCKED!

# ❌ Add API key in code
echo "const API_KEY = 'sk_live_abc123'" > src/config.ts
git commit  # BLOCKED!

# ❌ Poor formatting
echo "console.log(  'bad'  )" > src/test.ts
git commit  # BLOCKED! (Prettier reformats it)
```

### GitHub Actions Blocks:

```bash
# ❌ Someone tries to force-push with secrets
git push --force origin main
# GitHub Actions detects secrets in history
# ❌ PR blocked until fixed

# ❌ Code doesn't build
npm run build  # Fails
git push
# CI/CD fails, PR blocked
```

---

## 🚀 Usage Examples

### Example 1: Adding a New Feature

```bash
# Create feature branch
git checkout -b feature/new-api

# Code...
echo "export function newAPI() { ... }" > src/api.ts

# Stage and commit
git add src/api.ts
git commit -m "feat: add new API

- Implements new endpoint
- Returns user data
- Handles errors"

# Pre-commit runs:
# ✓ No secrets found
# ✓ ESLint passed
# ✓ Prettier formatted
# ✓ All checks passed

# Push
git push origin feature/new-api

# GitHub Actions:
# ✓ All checks pass
# ✓ Build succeeds
# ✓ Ready to merge
```

### Example 2: Accidentally Committing Secret

```bash
# Oops! Added API key
echo "API_KEY=sk_live_xyz" > .env
git add .env
git commit -m "Add env"

# Pre-commit hook runs:
# ❌ BLOCKED: Secrets detected in .env
# 
# Error:
# Commit failed: Secrets detected
# - .env contains API_KEY pattern

# Fix:
rm .env
cp .env.example .env
git reset
git add src/correct-file.ts
git commit -m "Fix: correct feature"
# ✓ Now commits successfully
```

### Example 3: Formatting Issues

```bash
# Write messy code
cat > src/messy.ts << 'HERE'
const   value   =   { a:1,b:2,c:3 }
function test(  ) {
    console.log('bad spacing')
}
HERE

git add src/messy.ts
git commit -m "Messy code"

# Pre-commit runs:
# ❌ Prettier found issues
# Automatically fixed:
# const value = { a: 1, b: 2, c: 3 };
# function test() {
#   console.log('bad spacing')
# }

# File was reformatted!
# ✓ Try commit again
git commit -m "Messy code"
# ✓ Success (already formatted)
```

---

## 📊 GitHub Actions Reports

### Artifacts (available after each run)

**secrets-report.json** - Full TruffleHog output
```json
{
  "branch": "main",
  "commit": "abc123...",
  "path": "config.ts",
  "reason": "High Entropy"
}
```

**eslint-report.json** - All linting issues
```json
{
  "ruleId": "no-console",
  "message": "Unexpected console statement"
}
```

### View in GitHub

1. Push code to GitHub
2. Go to repo → Actions tab
3. Click latest workflow run
4. View job results
5. Download artifacts for details

---

## 🛠️ Configuration Files

### .eslintrc.json

Controls linting rules:
- `no-console`: Warn in logs
- `@typescript-eslint/no-unused-vars`: Error
- `react/react-in-jsx-scope`: Off (not needed in React 17+)

**Customize:**
```json
{
  "rules": {
    "no-console": "off",  // Allow console.log
    "semi": ["error", "always"]  // Require semicolons
  }
}
```

### .prettierrc.json

Controls formatting:
- `singleQuote: true` - Use single quotes
- `printWidth: 100` - Line length limit
- `tabWidth: 2` - Indentation

**Customize:**
```json
{
  "printWidth": 120,  // Longer lines
  "tabWidth": 4       // 4-space indent
}
```

### .pre-commit-config.yaml

Controls which hooks run:
- Detect-secrets
- File validators
- ESLint
- Prettier

**Customize:**
```yaml
repos:
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        # Custom args
```

---

## 🆘 Troubleshooting

### Issue: "pre-commit: command not found"

**Solution:**
```bash
pip install pre-commit
pre-commit install
```

### Issue: ESLint errors on old code

**Solution:**
```bash
# Run fix-all mode
npm run lint -- --fix

# Then format
npm run format
```

### Issue: Secret detected (false positive)

**Solution:**
```bash
# Review detected secret
detect-secrets scan

# If it's safe to ignore:
detect-secrets audit .secrets.baseline
# Mark as "Is this a secret?" → No
```

### Issue: GitHub Actions failing

**Solution:**
1. Go to GitHub repo → Actions
2. Click failing workflow
3. Check error logs
4. Fix locally with: `pre-commit run --all-files`
5. Commit and push again

---

## 📚 Resources

- [Pre-commit Documentation](https://pre-commit.com/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [GitHub Actions](https://docs.github.com/en/actions)
- [TruffleHog](https://trufflesecurity.com/)

---

## ✅ Checklist

After setup, verify:

- [ ] `.eslintrc.json` exists
- [ ] `.prettierrc.json` exists
- [ ] `.pre-commit-config.yaml` exists
- [ ] `.secrets.baseline` exists
- [ ] `.github/workflows/ci.yml` exists
- [ ] `pre-commit` installed locally
- [ ] `npm run lint` works
- [ ] `npm run format` works
- [ ] Git commit triggers hooks
- [ ] GitHub Actions runs on push

---

**Last Updated:** 2026-04-06  
**Version:** 1.0  
**Status:** ✅ Production Ready

