# Contributing to DevKit

Thank you for your interest in contributing to DevKit! This document provides guidelines and best practices for contributing.

---

## Quick Start

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/kit.git
   cd kit
   git remote add upstream https://github.com/dspv/kit.git
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/bug-description
   # or
   git checkout -b docs/documentation-update
   ```

3. **Make Your Changes**
   - Follow the guidelines below
   - Run `./doctor.sh` to validate
   - Test your changes thoroughly

4. **Submit a Pull Request**
   ```bash
   git push origin your-branch-name
   ```
   Then open a PR on GitHub with a clear description.

---

## Code Standards

### English Only

All code, comments, documentation, and commit messages MUST be in English.

```bash
# ❌ BAD
git commit -m "добавил функцию"
// исправить баг

# ✅ GOOD
git commit -m "feat: add authentication function"
// Fix login validation bug
```

**Why**: AI agents perform 20-30% better with consistent language. Global collaboration standard.

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```bash
feat(doctor): add check for missing .ai/context.md
fix(makefile): correct Go build command
docs(readme): update installation instructions
```

### Documentation

- **Use DOCS.md**: Add implementation details to DOCS.md, not scattered files
- **Update GUIDE.md**: If changing core principles, update GUIDE.md
- **Keep README concise**: README is for quick start and overview only
- **No emoji**: Technical docs should be professional and emoji-free

### Code Quality

**Pre-commit Checks**:
```bash
./doctor.sh  # Must pass before committing
```

Validates:
- English-only content
- No hardcoded secrets
- Proper file structure
- Required files present

**Manual Testing**:
```bash
# Test in new project
cd /tmp
git clone your-fork
cd kit
./doctor.sh
make setup
```

---

## What to Contribute

### High Priority

1. **Bug Fixes**
   - doctor.sh validation errors
   - Makefile cross-platform issues
   - Pre-commit hook failures

2. **Documentation Improvements**
   - Clearer quick start instructions
   - More real-world examples
   - FAQ additions

3. **Platform Support**
   - Windows compatibility
   - Different shell environments
   - Alternative package managers

### Welcome Contributions

1. **Examples**
   - Sample .ai/context.md for different project types
   - Example DOCS.md structures
   - Industry-specific GUIDE.md adaptations

2. **Tooling**
   - GitHub Actions workflow improvements
   - VS Code extension
   - CLI tool for DevKit management

3. **Integrations**
   - Support for other AI assistants
   - IDE plugins
   - CI/CD templates

### Please Avoid

- **Emoji in technical files**: Keep docs professional
- **New scattered .md files**: Use DOCS.md instead
- **Language mixing**: English only, everywhere
- **Scope creep**: DevKit is intentionally minimal

---

## Testing Your Changes

### doctor.sh Validation

```bash
./doctor.sh
```

Must pass without errors. If it fails, fix issues before submitting PR.

### Test in Real Project

Apply your changes to a real project:

```bash
# Create test project
cd /tmp
mkdir test-devkit && cd test-devkit
git init

# Apply your DevKit changes
cp -R /path/to/your/kit/* .

# Test the workflow
./doctor.sh
make setup
make dev
```

### Test Pre-commit Hooks

```bash
# Test English-only enforcement
git commit -m "тест"  # Should fail

# Test secret detection
echo "API_KEY=sk_test_123" > .env
git add .env
git commit -m "add env"  # Should fail
```

---

## Pull Request Guidelines

### Before Submitting

- [ ] Run `./doctor.sh` and fix all issues
- [ ] Test changes in a real project
- [ ] Update relevant documentation
- [ ] Add examples if introducing new features
- [ ] Keep commits focused and atomic

### PR Description Template

```markdown
## Summary
Brief description of changes

## Motivation
Why is this change needed?

## Changes
- Bullet list of specific changes
- Include file names if relevant

## Testing
How was this tested?

## Screenshots
(if applicable)

## Checklist
- [ ] doctor.sh passes
- [ ] Documentation updated
- [ ] Examples added (if new feature)
- [ ] Tested in real project
```

### Review Process

1. **Automated Checks**: CI runs doctor.sh validation
2. **Maintainer Review**: Usually within 48-72 hours
3. **Feedback**: Address comments and update PR
4. **Merge**: Once approved, maintainer will merge

---

## Development Workflow

### Branch Naming

```bash
feat/your-feature    # New features
fix/bug-name        # Bug fixes
docs/topic          # Documentation
chore/task          # Maintenance
```

### Sync with Upstream

```bash
git fetch upstream
git rebase upstream/master
git push origin your-branch --force-with-lease
```

### Squash Commits (if needed)

```bash
git rebase -i HEAD~3  # Squash last 3 commits
```

---

## Community

### Get Help

- **GitHub Discussions**: [Ask questions](https://github.com/dspv/kit/discussions)
- **Issues**: [Report bugs](https://github.com/dspv/kit/issues)
- **Examples**: Check other projects using DevKit

### Code of Conduct

Be respectful:
- Professional communication
- Constructive feedback
- Collaborative problem-solving
- Assume good intentions

### Recognition

Contributors are recognized in:
- CHANGELOG.md for each release
- GitHub contributors page
- Special thanks in README (for major contributions)

---

## License

By contributing, you agree that your contributions will be licensed under the same license as DevKit:

**CYBRIX Unified License (AGPL-3.0 + Commercial Terms)**

See [LICENSE.md](./LICENSE.md) for full details.

- Open-source contributions: AGPL-3.0
- Must disclose source code in derivative works
- Commercial use requires separate license

---

## Questions?

Not sure if your contribution fits? [Open a discussion](https://github.com/dspv/kit/discussions) first!

**DevKit is built by the community, for the community. Every contribution matters.**

---

**DevKit v3.0** | [Back to README](README.md) | [View Issues](https://github.com/dspv/kit/issues)
