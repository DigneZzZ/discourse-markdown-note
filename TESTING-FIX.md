# Тестирование исправления настроек иконок и заголовков

## Проблема (исправлена в v0.8.1)
- Настройки "Discourse markdown note show titles" и "Discourse markdown note show icons" не работали
- Иконки и заголовки отображались даже при отключенных настройках

## Исправления
1. **Добавлены глобальные CSS селекторы** с `!important` для принудительного скрытия
2. **Изменена логика определения настроек** на строгое сравнение `=== true`
3. **Добавлено логирование** для диагностики проблем

## Как протестировать

### 1. Проверить текущие настройки
Перейти в **Admin → Plugins → discourse-markdown-note → Settings** и проверить:
- ☐ `discourse_markdown_note_show_titles` 
- ☐ `discourse_markdown_note_show_icons`

### 2. Тест 1: Отключить иконки
1. Снять галочку с `discourse_markdown_note_show_icons`
2. Сохранить настройки
3. Создать тестовый пост с заметками:
```
[note]Тест без иконок[/note]
[tip]Совет без иконок[/tip]
[bug]Ошибка без иконок[/bug]
```
**Ожидаемый результат:** Иконки не отображаются, отступы слева уменьшены

### 3. Тест 2: Отключить заголовки
1. Снять галочку с `discourse_markdown_note_show_titles`
2. Сохранить настройки
3. Создать тестовый пост
**Ожидаемый результат:** Заголовки ("Заметка:", "Совет:", "Ошибка:") не отображаются

### 4. Тест 3: Отключить всё
1. Снять обе галочки
2. Сохранить настройки
**Ожидаемый результат:** Только цветной фон и содержимое, без иконок и заголовков

### 5. Проверить в консоли разработчика
Открыть F12 → Console и найти сообщения:
```
[Markdown Notes] Settings - showTitles: false (false), showIcons: false (false)
[Markdown Notes] Applied classes - hide-note-titles: true, hide-note-icons: true
```

## Отладка
Если проблема сохраняется:

1. **Проверить в консоли** наличие CSS классов на body:
```javascript
document.body.classList.contains('hide-note-icons') // должно быть true
document.body.classList.contains('hide-note-titles') // должно быть true
```

2. **Проверить CSS переопределения** в DevTools - ищите `!important` в стилях

3. **Очистить кеш** браузера и перезагрузить страницу

## Поддерживаемые типы заметок
Исправление работает для всех 11 типов:
- note, info, warn, negative, positive, caution
- tip, todo, bug, feature, security (новые)
