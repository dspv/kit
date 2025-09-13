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
- изменение 2  
- изменение 3 (максимум 5 пунктов)
```

**Типы коммитов**:
- `feat:` - новая функциональность
- `fix:` - исправление бага
- `docs:` - изменения в документации
- `refactor:` - рефакторинг кода
- `test:` - добавление тестов
- `chore:` - технические изменения

### Формат PR
```markdown
## Описание
- что сделано
- какая проблема решена
- какие риски

## Тестирование
- [ ] unit тесты прошли
- [ ] lint прошёл
- [ ] локально протестировано

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

### Секреты
- ❌ Никогда не коммитить секреты
- ✅ Использовать .env.example
- ✅ Vault/SSM для production

### Код
- ✅ Валидация всех входных данных
- ✅ Санитизация выходных данных
- ✅ Структурированные логи без PII
- ✅ Регулярный аудит зависимостей

## 📊 Качество кода

### Стандарты
- **Функции**: маленькие, понятные
- **Ошибки**: явная обработка, не игнорировать
- **Логирование**: структурированное, без секретов
- **Зависимости**: зафиксированные версии

### Code Review
- **Фокус**: логика, безопасность, производительность
- **Время**: ответ в течение 24 часов
- **Конструктивность**: предложения, не только критика

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

## 🔄 Версионирование

### Файлы >2000 строк
1. Создать `filename.v2.md`
2. В старом файле добавить:
   ```markdown
   > Archived. See filename.v2.md
   ```

### Semantic Versioning
- `v1.0.0` - major release
- `v1.1.0` - minor features
- `v1.1.1` - bug fixes

## 🚨 Нарушения

### Блокирующие нарушения
- Отсутствие refs в PR
- Коммит секретов
- Падающие тесты в main
- Нарушение stage rules

### Процедура исправления
1. Немедленная остановка работы
2. Rollback изменений
3. Исправление проблемы
4. Повторная проверка

## 🔗 Связанные документы

- **Архитектура**: spec/arch.md
- **API**: spec/api.md
- **Roadmap**: spec/roadmap.md
- **Briefs**: spec/briefs/

---

**Последнее обновление**: [дата] | **Refs**: spec/arch.md#Standards; spec/roadmap.md#Quality
