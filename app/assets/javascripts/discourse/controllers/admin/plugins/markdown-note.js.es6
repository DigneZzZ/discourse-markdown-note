import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";
import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class AdminPluginsMarkdownNoteController extends Controller {
  @tracked noteSettings = {};
  @tracked saving = false;
  @tracked isDarkTheme = false;
  
  noteTypes = [
    { key: "note", icon: "📝", name: "Обычная заметка" },
    { key: "info", icon: "💡", name: "Информация" },
    { key: "warn", icon: "⚠️", name: "Предупреждение" },
    { key: "negative", icon: "❌", name: "Ошибка" },
    { key: "positive", icon: "✅", name: "Успех" },
    { key: "caution", icon: "🚨", name: "Осторожно" }
  ];

  @action
  async loadSettings() {
    try {
      const siteSettings = this.siteSettings;
      
      // Загружаем текущие настройки или используем значения по умолчанию
      this.noteSettings = {
        // Note
        note_bg_light: siteSettings.discourse_markdown_note_note_bg_light || 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        note_bg_dark: siteSettings.discourse_markdown_note_note_bg_dark || 'linear-gradient(135deg, #2c2c2c 0%, #3a3a3a 100%)',
        note_border: siteSettings.discourse_markdown_note_note_border || '#6c757d',
        note_text_light: siteSettings.discourse_markdown_note_note_text_light || '#495057',
        note_text_dark: siteSettings.discourse_markdown_note_note_text_dark || '#b0b0b0',
        
        // Info
        info_bg_light: siteSettings.discourse_markdown_note_info_bg_light || 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        info_bg_dark: siteSettings.discourse_markdown_note_info_bg_dark || 'linear-gradient(135deg, #1a2332 0%, #243447 100%)',
        info_border: siteSettings.discourse_markdown_note_info_border || '#2196f3',
        info_text_light: siteSettings.discourse_markdown_note_info_text_light || '#1565c0',
        info_text_dark: siteSettings.discourse_markdown_note_info_text_dark || '#90caf9',
        
        // Warn
        warn_bg_light: siteSettings.discourse_markdown_note_warn_bg_light || 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)',
        warn_bg_dark: siteSettings.discourse_markdown_note_warn_bg_dark || 'linear-gradient(135deg, #332b1a 0%, #473a24 100%)',
        warn_border: siteSettings.discourse_markdown_note_warn_border || '#ff9800',
        warn_text_light: siteSettings.discourse_markdown_note_warn_text_light || '#e65100',
        warn_text_dark: siteSettings.discourse_markdown_note_warn_text_dark || '#ffcc02',
        
        // Negative
        negative_bg_light: siteSettings.discourse_markdown_note_negative_bg_light || 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
        negative_bg_dark: siteSettings.discourse_markdown_note_negative_bg_dark || 'linear-gradient(135deg, #331a1a 0%, #472424 100%)',
        negative_border: siteSettings.discourse_markdown_note_negative_border || '#f44336',
        negative_text_light: siteSettings.discourse_markdown_note_negative_text_light || '#c62828',
        negative_text_dark: siteSettings.discourse_markdown_note_negative_text_dark || '#ff8a80',
        
        // Positive
        positive_bg_light: siteSettings.discourse_markdown_note_positive_bg_light || 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
        positive_bg_dark: siteSettings.discourse_markdown_note_positive_bg_dark || 'linear-gradient(135deg, #1a331a 0%, #244724 100%)',
        positive_border: siteSettings.discourse_markdown_note_positive_border || '#4caf50',
        positive_text_light: siteSettings.discourse_markdown_note_positive_text_light || '#2e7d32',
        positive_text_dark: siteSettings.discourse_markdown_note_positive_text_dark || '#a5d6a7',
        
        // Caution
        caution_bg_light: siteSettings.discourse_markdown_note_caution_bg_light || 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
        caution_bg_dark: siteSettings.discourse_markdown_note_caution_bg_dark || 'linear-gradient(135deg, #331a26 0%, #472433 100%)',
        caution_border: siteSettings.discourse_markdown_note_caution_border || '#e91e63',
        caution_text_light: siteSettings.discourse_markdown_note_caution_text_light || '#ad1457',
        caution_text_dark: siteSettings.discourse_markdown_note_caution_text_dark || '#f48fb1'      };
      
      // Load display settings
      this.showTitles = siteSettings.discourse_markdown_note_show_titles !== false;
      this.showIcons = siteSettings.discourse_markdown_note_show_icons !== false;
      
      this.updatePreviewColors();
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
    }
  }

  @action
  toggleTitles() {
    this.showTitles = !this.showTitles;
    this.updatePreviewDisplay();
  }

  @action
  toggleIcons() {
    this.showIcons = !this.showIcons;
    this.updatePreviewDisplay();
  }

  @action
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.updatePreviewColors();
  }

  @action
  updateColor(event) {
    const setting = event.target.dataset.setting;
    const value = event.target.value;
    
    this.noteSettings = {
      ...this.noteSettings,
      [setting]: value
    };
    
    this.updatePreviewColors();
  }
  @action
  updatePreviewDisplay() {
    const previewContainer = document.querySelector('.markdown-note-settings');
    
    if (previewContainer) {
      // Управление отображением заголовков
      if (this.showTitles) {
        previewContainer.classList.remove('hide-note-titles');
      } else {
        previewContainer.classList.add('hide-note-titles');
      }
      
      // Управление отображением иконок
      if (this.showIcons) {
        previewContainer.classList.remove('hide-note-icons');
      } else {
        previewContainer.classList.add('hide-note-icons');
      }
    }
  }

  @action
  updatePreviewColors() {
    this.noteTypes.forEach(type => {
      const previewElement = document.querySelector(`[data-preview-type="${type.key}"]`);
      if (previewElement) {
        const bgSuffix = this.isDarkTheme ? '_dark' : '_light';
        const textSuffix = this.isDarkTheme ? '_dark' : '_light';
        
        const bgColor = this.noteSettings[`${type.key}_bg${bgSuffix}`];
        const borderColor = this.noteSettings[`${type.key}_border`];
        const textColor = this.noteSettings[`${type.key}_text${textSuffix}`];
        
        if (bgColor) previewElement.style.setProperty('background', bgColor);
        if (borderColor) previewElement.style.setProperty('border-left-color', borderColor);
        if (textColor) previewElement.style.setProperty('color', textColor);
      }
    });
    
    // Также обновляем параметры отображения
    this.updatePreviewDisplay();
  }  @action
  async saveSettings() {
    this.saving = true;
    
    try {
      // Сохраняем каждую настройку цветов через Site Settings API
      const savePromises = Object.keys(this.noteSettings).map(key => {
        const settingName = `discourse_markdown_note_${key}`;
        return ajax(`/admin/site_settings/${settingName}`, {
          type: 'PUT',
          data: { [settingName]: this.noteSettings[key] }
        });
      });
      
      // Сохраняем настройки отображения
      savePromises.push(
        ajax('/admin/site_settings/discourse_markdown_note_show_titles', {
          type: 'PUT',
          data: { discourse_markdown_note_show_titles: this.showTitles }
        })
      );
      
      savePromises.push(
        ajax('/admin/site_settings/discourse_markdown_note_show_icons', {
          type: 'PUT',
          data: { discourse_markdown_note_show_icons: this.showIcons }
        })
      );
      
      await Promise.all(savePromises);
      
      // Применяем настройки глобально
      this.updateGlobalStyles();
      this.showStatus('Settings saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      this.showStatus('Error saving settings', 'error');
      popupAjaxError(error);
    } finally {
      this.saving = false;
    }
  }

  @action
  resetDefaults() {
    // Сбрасываем к значениям по умолчанию из settings.yml
    this.noteSettings = {
      // Note
      note_bg_light: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      note_bg_dark: 'linear-gradient(135deg, #2c2c2c 0%, #3a3a3a 100%)',
      note_border: '#6c757d',
      note_text_light: '#495057',
      note_text_dark: '#b0b0b0',
      
      // Info
      info_bg_light: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
      info_bg_dark: 'linear-gradient(135deg, #1a2332 0%, #243447 100%)',
      info_border: '#2196f3',
      info_text_light: '#1565c0',
      info_text_dark: '#90caf9',
      
      // Warn
      warn_bg_light: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)',
      warn_bg_dark: 'linear-gradient(135deg, #332b1a 0%, #473a24 100%)',
      warn_border: '#ff9800',
      warn_text_light: '#e65100',
      warn_text_dark: '#ffcc02',
      
      // Negative
      negative_bg_light: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
      negative_bg_dark: 'linear-gradient(135deg, #331a1a 0%, #472424 100%)',
      negative_border: '#f44336',
      negative_text_light: '#c62828',
      negative_text_dark: '#ff8a80',
      
      // Positive
      positive_bg_light: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
      positive_bg_dark: 'linear-gradient(135deg, #1a331a 0%, #244724 100%)',
      positive_border: '#4caf50',
      positive_text_light: '#2e7d32',
      positive_text_dark: '#a5d6a7',
      
      // Caution
      caution_bg_light: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
      caution_bg_dark: 'linear-gradient(135deg, #331a26 0%, #472433 100%)',
      caution_border: '#e91e63',
      caution_text_light: '#ad1457',
      caution_text_dark: '#f48fb1'
    };
    
    this.updateFormColors();
    this.updatePreviewColors();
  }

  @action
  updateFormColors() {
    Object.keys(this.noteSettings).forEach(key => {
      const input = document.querySelector(`[data-setting="${key}"]`);
      if (input) {
        input.value = this.noteSettings[key];
      }
    });
  }

  @action
  updateGlobalStyles() {
    let styleElement = document.getElementById('markdown-note-custom-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'markdown-note-custom-styles';
      document.head.appendChild(styleElement);
    }
    
    let cssText = ':root {\n';
    Object.keys(this.noteSettings).forEach(key => {
      const cssVar = key.replace(/_/g, '-');
      cssText += `  --${cssVar}: ${this.noteSettings[key]};\n`;
    });
    cssText += '}\n';
    
    styleElement.textContent = cssText;
  }

  showStatus(message, type) {
    const statusElement = document.querySelector('.admin-status');
    if (statusElement) {
      statusElement.className = `admin-status ${type}`;
      statusElement.textContent = message;
      
      setTimeout(() => {
        statusElement.textContent = '';
        statusElement.className = 'admin-status';
      }, 3000);
    }
  }
}
