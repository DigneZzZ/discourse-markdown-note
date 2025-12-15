# Discourse Markdown Note Plugin

![Version](https://img.shields.io/badge/version-1.1.3-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

🌐 **[Русская версия](README.md)**

A Discourse plugin that adds support for beautifully styled BBCode notes with full dark theme support and flexible customization options.

<img width="285" height="368" alt="screenshot" src="https://github.com/user-attachments/assets/48d613ab-dcdb-489d-90f8-510473fa9f61" />


## Features

- ✅ 8 optimized note types: `note`, `info`, `warn`, `error`, `success`, `important`, `security`, `question`
- ✅ Backward compatibility with legacy types (`negative`, `positive`, `caution`, `attention`, `tip`)
- ✅ Beautiful design with gradient backgrounds and emoji icons
- ✅ Full light and dark theme support with automatic detection
- ✅ **Editor button** with dropdown menu for quick note insertion
- ✅ **Interactive color picker** in admin panel
- ✅ Flexible settings through the standard plugin settings panel
- ✅ Localization in Russian and English
- ✅ Responsive design for mobile devices
- ✅ Accessibility: `role="note"` and `aria-hidden` support

## Syntax

### Optimized type set (recommended):
```
[note]This is a regular note 📝[/note]
[info]This is an informational note 💡[/info]
[warn]This is a warning ⚠️[/warn]
[error]This is an error message ❌[/error]
[success]This is a success message ✅[/success]
[important]This is important information 🔥[/important]
[security]This is a security note 🔒[/security]
[question]This is a question or FAQ ❓[/question]
```

### Legacy types (fully supported and automatically displayed as new types):
```
[negative]Error (displayed as error) ❌[/negative]
[positive]Success (displayed as success) ✅[/positive]
[caution]Important (displayed as important) 🔥[/caution]
[attention]Important (displayed as important) 🔥[/attention]
[tip]Information (displayed as info) 💡[/tip]
```

### Legacy syntax (supported for compatibility):
```
[note type="info"]Informational note[/note]
[note type="warn"]Warning[/note]
```

## Installation

1. Copy the plugin files to your Discourse `plugins/discourse-markdown-note/` folder
2. Restart Discourse
3. Enable the plugin in the admin panel: Settings → Plugins → discourse-markdown-note

## Admin Panel

To configure the plugin, go to:
**Admin → Settings → Plugins → discourse_markdown_note**

### Available settings:

| Setting | Description |
|---------|-------------|
| `enabled` | Enable/disable the plugin |
| `theme_mode` | Theme mode: auto, light, dark |
| `show_titles` | Show note titles |
| `show_icons` | Show emoji icons |

### Color customization:

For each of the 8 note types, you can customize:
- 🎨 **Border color** — interactive color picker
- 🎨 **Text color (light theme)** — interactive color picker
- 🎨 **Text color (dark theme)** — interactive color picker
- 📝 **Background (light/dark theme)** — CSS gradients

## Editor Button

When creating or editing a post, a 📋 button appears in the toolbar with a dropdown menu of all note types:

1. Click the note button in the editor
2. Select the desired type from the dropdown list
3. The BBCode tag will be inserted automatically

## Note Types

### 📝 Note (Regular note)
Used for general information and basic notes.

### 💡 Info (Information)
For useful tips and additional information. Legacy type `tip` automatically converts to `info`.

### ⚠️ Warn (Warning)
For warnings about potential issues.

### ❌ Error
For error messages and critical issues. Legacy type `negative` automatically converts to `error`.

### ✅ Success
For positive notifications and success messages. Legacy type `positive` automatically converts to `success`.

### 🔥 Important
For particularly important notifications requiring attention. Legacy types `caution` and `attention` automatically convert to `important`.

### 🔒 Security
For notes related to security and privacy.

### ❓ Question
For questions, FAQs, and interactive elements.

## Technical Information

### Version
Current version: **1.1.3**

### File Structure
```
plugin.rb                          # Main plugin file
assets/
  javascripts/
    discourse-markdown/
      notifications.js.es6         # Markdown processing
    initializers/
      note-theme-settings.js.es6   # Theme settings
      note-editor-button.js.es6    # Editor button with dropdown menu
  stylesheets/
    notifications.scss             # Main styles
config/
  settings.yml                     # Plugin settings
  locales/
    client.ru.yml                  # Russian localization
    client.en.yml                  # English localization
    server.ru.yml                  # Russian server localization
    server.en.yml                  # English server localization
```

### Compatibility
- Discourse version 2.8+
- Modern browser support
- Mobile devices

## Development

### Development Requirements
- Ruby 2.7+
- Node.js 14+
- Git

### Local Development
```bash
# Clone to Discourse plugins folder
cd /path/to/discourse/plugins
git clone https://github.com/your-repo/discourse-markdown-note.git

# Restart Discourse
cd /path/to/discourse
./launcher rebuild app
```

### Testing
The plugin automatically tests:
- Processing of all 8 note types
- Backward compatibility with legacy types
- Automatic mapping of deprecated types
- HTML output correctness
- Theme support

## License

MIT License - see LICENSE file for details.

## Author

DigneZzZ

## Support

If you have questions or suggestions:
1. Create an Issue in the repository
2. Describe the problem in detail
3. Attach screenshots if necessary

## Changelog

### v1.1.3 (Current) - Editor fix
- ✅ Fixed note insertion in editor - selected text is now correctly wrapped with BBCode tags
- ✅ Used `applySurround()` method instead of `addText()` for proper handling of selected text

### v1.1.2 - Editor button fixes
- ✅ Fixed editor button icon (now displays correctly)
- ✅ Improved button search for dropdown positioning
- ✅ Added fixed positioning for dropdown menu

### v1.1.1 - Dropdown fixes
- ✅ Fixed dropdown menu positioning
- ✅ Added fallback when button is not found

### v1.1.0 - Editor and UX
- ✅ **Editor button** with dropdown menu for quick note insertion
- ✅ **Interactive color picker** in admin panel for color selection
- ✅ JS refactoring: code deduplication, extraction into functions
- ✅ Added i18n support for note titles
- ✅ Optional logging via DEBUG flag
- ✅ Accessibility: added `role="note"` and `aria-hidden` for icons
- ✅ Block padding optimization (~37% more compact)
- ✅ Fixed broken emojis in CSS (🔥, 💡)
- ✅ Updated prettier to version 3.4.2

### v1.0.0 - Note types optimization
- ✅ Optimized from 9 to 8 note types
- ✅ Renamed types: `negative` → `error`, `positive` → `success`, `caution` → `important`
- ✅ Removed duplicate types: `attention` (→ `important`), `tip` (→ `info`)
- ✅ Added new `question` type for FAQ and questions
- ✅ Ensured full backward compatibility through automatic mapping
- ✅ Updated translations in Russian and English
- ✅ Improved CSS structure with optimized styles
- ✅ Updated documentation and test files

### v0.5.0 - Admin panel
- ✅ Added admin settings panel
- ✅ Ability to customize colors for all note types
- ✅ Real-time preview of changes
- ✅ Improved CSS structure with variables

### v0.4.0 - Extended support
- ✅ Extended support for 9 note types
- ✅ Added editor button with dropdown menu
- ✅ Full dark theme support
- ✅ Localization in Russian and English

### v0.3.0 - Improved design
- ✅ Beautiful design with gradients and shadows
- ✅ Emoji icons for each note type
- ✅ Mobile device responsiveness

### v0.2.0 - Basic functionality
- ✅ Basic support for all note types
- ✅ Legacy syntax processing

### v0.1.0 - First release
- ✅ First release with basic functionality
