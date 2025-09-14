# Project Rules and Policies

> **🎯 Purpose**: Unified rules for all project participants

## 🔒 General Rules

### Project Language
- **Code**: English (variables, functions, comments)
- **Documentation**: English (spec/, README)
- **Commits**: English
- **PR descriptions**: English

### Refs Contract (MANDATORY)
Any work result MUST contain minimum 2 references to specifications:

```
Refs: spec/arch.md#Components; spec/policy.md#Rules
```

**Examples of correct refs**:
- `Refs: spec/api.md#Authentication; spec/arch.md#Security`
- `Refs: spec/roadmap.md#Phase1; spec/policy.md#Testing`

## 🔄 Stage Rules

### incubate
- ✅ Direct pushes to main
- ✅ Fast iterations
- ✅ Unit tests mandatory
- ❌ No code review requirements

### beta
- ✅ Pull Request only
- ✅ 1 approval mandatory
- ✅ unit + lint + preview deploy
- ✅ Documentation updated

### release
- ✅ Tags v* (semantic versioning)
- ✅ 2 approvals mandatory
- ✅ unit + lint + e2e + security
- ✅ Complete documentation
- ✅ Changelog updated

## 📝 Commits and PRs

### Commit Format
```
type: brief description

- change 1
- change 2
- change 3 (maximum 5 points)
```

**Commit Types**:
- `feat:` - new functionality
- `fix:` - bug fix
- `docs:` - documentation changes
- `refactor:` - code refactoring
- `test:` - adding tests
- `chore:` - technical changes

### PR Format
```markdown
## Description
- what was done
- what problem was solved
- what risks exist

## Testing
- [ ] unit tests passed
- [ ] lint passed
- [ ] tested locally

## Refs
spec/arch.md#Components; spec/policy.md#Rules
```

## 🧪 Testing

### Mandatory Checks
- **Unit tests**: coverage >80%
- **Lint**: no errors
- **Build**: successful build
- **Security**: dependency scanning

### Additional Checks (beta+)
- **Integration tests**: API endpoints
- **E2E tests**: critical user flows
- **Performance tests**: load testing

## 🗄️ Database Management

### Schema Management (if database exists)
- **Keep `schema.sql` updated**: Must reflect current production state
- **Sync with migrations**: Update `schema.sql` after each migration deployment
- **Weekly validation**: Verify `schema.sql` matches actual DB structure
- **Version control**: Track all schema changes in git
- **Documentation**: Comment complex schema decisions

### Migration Rules
- **Versioned migrations**: Maintain `up`/`down` migration files
- **Naming convention**: `YYYYMMDD_HHMMSS_description.up.sql`
- **Rollback ready**: Always create corresponding `.down.sql`
- **Test migrations**: Validate on staging before production
- **No direct schema changes**: All changes through migrations only

## 🔐 Security

### Secrets
- ❌ Never commit secrets
- ✅ Use .env.example
- ✅ Vault/SSM for production

### Code
- ✅ Validate all input data
- ✅ Sanitize output data
- ✅ Structured logs without PII
- ✅ Regular dependency audit

## 📊 Code Quality

### Standards
- **Functions**: small, understandable
- **Errors**: explicit handling, don't ignore
- **Logging**: structured, without secrets
- **Dependencies**: fixed versions

### Code Review
- **Focus**: logic, security, performance
- **Time**: response within 24 hours
- **Constructive**: suggestions, not just criticism

## 🗂️ Documentation

### Mandatory Files
- `README.md` - for humans
- `ROBOT.md` - for AI agents
- `spec/` - complete specification
- `.env.example` - configuration examples

### README Status Requirements (MANDATORY)
Every README.md MUST have visible status indicators at the top:

```markdown
🚀 Status: [Current Status] ([Progress%])
📅 Timeline: [X Days/Weeks] 
🎯 Focus: [Current Focus Area]
```

**Examples:**
- `🚀 Status: MVP Complete (100%)`
- `📅 Timeline: 3 Days`
- `🎯 Focus: Complete Lead Management System`

**Status Format Rules:**
- **Status**: Current project state (Planning/Development/Testing/MVP Complete/Production)
- **Progress**: Percentage completion (0-100%)
- **Timeline**: Remaining time or total duration
- **Focus**: Current main work area (max 6 words)
- **Each indicator on separate line** for maximum readability
- **Always at top of README** (after title, before description)
- **Update daily** to reflect current state

### Documentation Updates
- ✅ On every API change
- ✅ On new feature addition
- ✅ On architecture changes
- ✅ Weekly - progress in roadmap
- ✅ **Daily - README status indicators**

## 🔄 Versioning

### Files >2000 lines
1. Create `filename.v2.md`
2. Add banner to old file:
   ```markdown
   > Archived. See filename.v2.md
   ```

### Semantic Versioning
- `v1.0.0` - major release
- `v1.1.0` - minor features
- `v1.1.1` - bug fixes

## 🚨 Violations

### Blocking Violations
- Missing refs in PR
- Committed secrets
- Failing tests in main
- Stage rule violations

### Fix Procedure
1. Immediate work stop
2. Rollback changes
3. Fix the problem
4. Re-verify

## 🔗 Related Documents

- **Architecture**: spec/arch.md
- **API**: spec/api.md
- **Roadmap**: spec/roadmap.md

---

**Last Updated**: [date] | **Refs**: spec/arch.md#Standards; spec/roadmap.md#Quality
