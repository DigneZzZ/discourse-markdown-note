# Discourse Markdown Note Plugin

Плагин для Discourse, добавляющий поддержку красиво оформленных заметок в стиле BBCode с полной поддержкой темной темы и гибкими настройками.

## Возможности

- ✅ 8 оптимизированных типов заметок: `note`, `info`, `warn`, `error`, `success`, `important`, `security`, `question`
- ✅ Обратная совместимость со старыми типами (`negative`, `positive`, `caution`, `attention`, `tip`)
- ✅ Красивый дизайн с градиентными фонами и иконками-эмодзи
- ✅ Полная поддержка светлой и темной тем с автоматическим определением
- ✅ Гибкие настройки через стандартную панель настроек плагина
- ✅ Локализация на русском и английском языках
- ✅ Адаптивный дизайн для мобильных устройств
- ✅ Улучшенная прозрачность для светлой темы

## Синтаксис

### Оптимизированный набор типов (рекомендуется):
```
[note]Это обычная заметка 📝[/note]
[info]Это информационная заметка 💡[/info]
[warn]Это предупреждение ⚠️[/warn]
[error]Это сообщение об ошибке ❌[/error]
[success]Это сообщение об успехе ✅[/success]
[important]Это важная информация 🔥[/important]
[security]Это заметка безопасности 🔒[/security]
[question]Это вопрос или FAQ ❓[/question]
```

### Старые типы (полностью поддерживаются и автоматически отображаются как новые):
```
[negative]Ошибка (отображается как error) ❌[/negative]
[positive]Успех (отображается как success) ✅[/positive]
[caution]Важно (отображается как important) 🔥[/caution]
[attention]Важно (отображается как important) 🔥[/attention]
[tip]Информация (отображается как info) 💡[/tip]
```

### Старый синтаксис (поддерживается для совместимости):
```
[note type="info"]Информационная заметка[/note]
[note type="warn"]Предупреждение[/note]
```

## Установка

1. Скопируйте файлы плагина в папку `plugins/discourse-markdown-note/` вашего Discourse
2. Перезапустите Discourse
3. Включите плагин в административной панели: Настройки → Плагины → discourse-markdown-note

## Административная панель

Для настройки цветов заметок перейдите в:
**Админ → Плагины → Настройки заметок Markdown**

В панели вы можете:
- Настроить цвета фона, границ и текста для каждого типа заметки
- Просмотреть изменения в реальном времени
- Сбросить настройки к значениям по умолчанию
- Сохранить изменения для всех пользователей

## Типы заметок

### 📝 Note (Обычная заметка)
Используется для общей информации и базовых заметок.

### 💡 Info (Информация)
Для полезных советов и дополнительной информации. Старый тип `tip` автоматически конвертируется в `info`.

### ⚠️ Warn (Предупреждение)
Для предупреждений о потенциальных проблемах.

### ❌ Error (Ошибка)
Для сообщений об ошибках и критических проблемах. Старый тип `negative` автоматически конвертируется в `error`.

### ✅ Success (Успех)
Для положительных уведомлений и сообщений об успехе. Старый тип `positive` автоматически конвертируется в `success`.

### � Important (Важно)
Для особо важных уведомлений, требующих внимания. Старые типы `caution` и `attention` автоматически конвертируются в `important`.

### 🔒 Security (Безопасность)
Для заметок, связанных с безопасностью и конфиденциальностью.

### ❓ Question (Вопрос)
Для вопросов, FAQ и интерактивных элементов.

## Техническая информация

### Версия
Текущая версия: **1.0.0**

### Структура файлов
```
plugin.rb                          # Основной файл плагина
assets/
  javascripts/
    discourse-markdown/
      notifications.js.es6         # Обработка Markdown
    initializers/
      note-theme-settings.js.es6   # Настройки темы
  stylesheets/
    notifications.scss             # Основные стили
config/
  settings.yml                     # Настройки плагина
  locales/
    client.ru.yml                  # Русская локализация
    client.en.yml                  # Английская локализация
    server.ru.yml                  # Русская серверная локализация
    server.en.yml                  # Английская серверная локализация
```

### Совместимость
- Discourse версии 2.8+
- Поддержка современных браузеров
- Мобильные устройства

## Разработка

### Требования для разработки
- Ruby 2.7+
- Node.js 14+
- Git

### Локальная разработка
```bash
# Клонирование в папку плагинов Discourse
cd /path/to/discourse/plugins
git clone https://github.com/your-repo/discourse-markdown-note.git

# Перезапуск Discourse
cd /path/to/discourse
./launcher rebuild app
```

### Тестирование
Плагин автоматически тестирует:
- Обработку всех 8 типов заметок
- Обратную совместимость со старыми типами
- Автоматическое мапирование устаревших типов
- Корректность HTML вывода
- Поддержку тем

## Лицензия

MIT License - см. файл LICENSE для деталей.

## Автор

DigneZzZ

## Поддержка

Если у вас есть вопросы или предложения:
1. Создайте Issue в репозитории
2. Опишите проблему подробно
3. Приложите скриншоты, если необходимо

## Changelog

### v1.0.0 (Текущая) - Оптимизация типов заметок
- ✅ Оптимизирован набор с 9 до 8 типов заметок
- ✅ Переименованы типы: `negative` → `error`, `positive` → `success`, `caution` → `important`
- ✅ Убраны дублирующие типы: `attention` (→ `important`), `tip` (→ `info`)
- ✅ Добавлен новый тип `question` для FAQ и вопросов
- ✅ Обеспечена полная обратная совместимость через автоматическое мапирование
- ✅ Обновлены переводы на русском и английском языках
- ✅ Улучшена структура CSS с оптимизированными стилями
- ✅ Обновлена документация и тестовые файлы

### v0.5.0 - Административная панель
- ✅ Добавлена административная панель настроек
- ✅ Возможность настройки цветов для всех типов заметок
- ✅ Предпросмотр изменений в реальном времени
- ✅ Улучшенная структура CSS с переменными

### v0.4.0 - Расширенная поддержка
- ✅ Расширена поддержка 9 типов заметок
- ✅ Добавлена кнопка в редактор с выпадающим меню
- ✅ Полная поддержка темной темы
- ✅ Локализация на русском и английском

### v0.3.0 - Улучшенный дизайн
- ✅ Красивый дизайн с градиентами и тенями
- ✅ Иконки-эмодзи для каждого типа заметки
- ✅ Адаптивность для мобильных устройств

### v0.2.0 - Базовая функциональность
- ✅ Базовая поддержка всех типов заметок
- ✅ Обработка старого синтаксиса

### v0.1.0 - Первый релиз
- ✅ Первый релиз с базовой функциональностью
