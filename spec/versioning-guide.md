# Versioning Guide

> **🎯 Goal**: Managing versions of large files and milestones

## 📏 File Versioning Rules

### When to Create New Version

1. **Размер файла >2000 строк**
2. **Milestone закрыт** (major release)
3. **Кардинальные изменения** в архитектуре/API
4. **Смена stage** проекта (incubate → beta → release)

### Процедура версионирования

#### 1. Создание новой версии
```bash
# Пример: spec/roadmap.md → spec/roadmap.v2.md
cp spec/roadmap.md spec/roadmap.v2.md
```

#### 2. Добавление баннера в старый файл
```markdown
> **📦 Archived**: This version is archived. See [roadmap.v2.md](roadmap.v2.md) for current version.
```

#### 3. Обновление ссылок
Найти и обновить все ссылки на старый файл:
```bash
# Поиск ссылок
grep -r "spec/roadmap.md" .

# Обновление refs-контрактов
# Старые: Refs: spec/roadmap.md#Phase1
# Новые: Refs: spec/roadmap.v2.md#Phase1
```

## 📋 Примеры версионирования

### Roadmap версионирование
```markdown
# spec/roadmap.md (archived)

> **📦 Archived**: This version is archived. See [roadmap.v2.md](roadmap.v2.md) for current version.

# [Project Name] - Development Roadmap (v1)

> **Status**: Completed | **Archive Date**: 2024-01-15

## Completed Phases

### Phase 1: MVP (Completed)
- ✅ User authentication
- ✅ Basic CRUD operations
- ✅ API endpoints

### Phase 2: Beta (Completed)  
- ✅ UI improvements
- ✅ Performance optimization
- ✅ Testing coverage

---

**Archived Version**: v1 | **Refs**: spec/arch.md#Legacy; spec/policy.md#Versioning
```

### API версионирование
```markdown
# spec/api.md (archived)

> **📦 Archived**: API v1 documentation. See [api.v2.md](api.v2.md) for current API v2.

# API Specification v1 (Deprecated)

> **Deprecation Date**: 2024-02-01  
> **End of Life**: 2024-06-01

## Migration Guide

### Breaking Changes in v2
- Authentication moved from API keys to JWT
- Response format changed
- New rate limiting rules

### Migration Steps
1. Update authentication to JWT
2. Update response parsing
3. Handle new error codes

---

**Deprecated Version**: v1 | **Refs**: spec/api.v2.md#Migration; spec/policy.md#Deprecation
```

## 🔄 Автоматическое версионирование

### Doctor Script Integration
```bash
# В doctor.sh уже есть проверка размера файлов
./doctor.sh

# Вывод:
# ⚠️  spec/roadmap.md содержит 2150 строк (>2000)
#   💡 Рекомендуется создать spec/roadmap.v2.md
```

### Git Hooks
```bash
# Pre-commit hook проверяет размер файлов
git commit -m "feat: large update"

# Если файл >2000 строк:
# ❌ File spec/roadmap.md is too large (2150 lines)
# 💡 Consider creating spec/roadmap.v2.md
# 💡 Run: ./version-file.sh spec/roadmap.md
```

## 🛠️ Утилиты версионирования

### Скрипт автоматического версионирования
```bash
#!/bin/bash
# version-file.sh

FILE=$1
if [[ ! -f "$FILE" ]]; then
    echo "❌ File not found: $FILE"
    exit 1
fi

# Определяем новое имя файла
BASE_NAME=$(basename "$FILE" .md)
DIR_NAME=$(dirname "$FILE")
NEW_FILE="$DIR_NAME/$BASE_NAME.v2.md"

# Проверяем, что v2 не существует
if [[ -f "$NEW_FILE" ]]; then
    echo "❌ Version 2 already exists: $NEW_FILE"
    exit 1
fi

# Создаём новую версию
cp "$FILE" "$NEW_FILE"

# Добавляем баннер в старый файл
BANNER="> **📦 Archived**: This version is archived. See [$BASE_NAME.v2.md]($BASE_NAME.v2.md) for current version."
echo -e "$BANNER\n\n$(cat $FILE)" > "$FILE"

echo "✅ Created version 2: $NEW_FILE"
echo "✅ Added archive banner to: $FILE"
echo "💡 Don't forget to update refs in other files"
```

## 📊 Версионирование по типам файлов

### Спецификации (spec/*.md)
- **Триггер**: >2000 строк ИЛИ major milestone
- **Формат**: `filename.v2.md`
- **Баннер**: Archive notice с ссылкой

### Briefs (spec/briefs/*.md)
- **Триггер**: Только при major milestone
- **Формат**: `role.v2.md`
- **Автогенерация**: Doctor script обновляет

### Roadmap
- **Триггер**: Завершение major phase
- **Формат**: `roadmap.v2.md`
- **Содержание**: Новые phases, архив старых

### API Documentation
- **Триггер**: Breaking changes в API
- **Формат**: `api.v2.md`
- **Содержание**: Migration guide обязателен

## 🔗 Управление ссылками

### Поиск и замена refs
```bash
# Найти все refs на старый файл
grep -r "spec/roadmap.md" . --include="*.md"

# Заменить refs на новую версию
sed -i 's/spec\/roadmap\.md/spec\/roadmap.v2.md/g' spec/*.md

# Проверить результат
grep -r "spec/roadmap" . --include="*.md"
```

### Валидация refs после версионирования
```bash
# В doctor.sh добавить проверку
check_refs_validity() {
    find . -name "*.md" -exec grep -l "Refs:" {} \; | while read file; do
        grep "Refs:" "$file" | while read ref_line; do
            # Извлечь файлы из refs
            # Проверить существование файлов
            # Предупредить о битых ссылках
        done
    done
}
```

## 📈 Метрики версионирования

### Отслеживание версий
| File | Current Version | Lines | Last Updated | Status |
|------|----------------|-------|--------------|--------|
| roadmap.md | v2 | 1500 | 2024-01-15 | Active |
| api.md | v1 | 800 | 2024-01-10 | Active |
| arch.md | v1 | 2200 | 2024-01-12 | Needs v2 |

### Статистика архивирования
- **Всего версий**: 3
- **Активных файлов**: 12
- **Архивных файлов**: 3
- **Средний размер**: 1200 строк

---

**Последнее обновление**: [дата] | **Refs**: spec/policy.md#Versioning; spec/arch.md#Documentation
