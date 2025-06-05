import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";
import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class AdminPluginsMarkdownNoteController extends Controller {
  @tracked noteSettings = {};
  @tracked saving = false;
  
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
      // Устанавливаем значения по умолчанию
      this.noteSettings = {
        note_bg_color: '#e8f4fd',
        note_border_color: '#1f8ce6',
        note_text_color: '#0c5aa6',
        info_bg_color: '#fff8e1',
        info_border_color: '#ff9800',
        info_text_color: '#e65100',
        warn_bg_color: '#fff3e0',
        warn_border_color: '#ff5722',
        warn_text_color: '#d84315',
        negative_bg_color: '#ffebee',
        negative_border_color: '#f44336',
        negative_text_color: '#c62828',
        positive_bg_color: '#e8f5e8',
        positive_border_color: '#4caf50',
        positive_text_color: '#2e7d32',
        caution_bg_color: '#fce4ec',
        caution_border_color: '#e91e63',
        caution_text_color: '#ad1457'
      };
      
      this.updatePreviewColors();
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
    }
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
  updatePreviewColors() {
    this.noteTypes.forEach(type => {
      const previewElement = document.querySelector(`[data-preview-type="${type.key}"]`);
      if (previewElement) {
        const bgColor = this.noteSettings[`${type.key}_bg_color`];
        const borderColor = this.noteSettings[`${type.key}_border_color`];
        const textColor = this.noteSettings[`${type.key}_text_color`];
        
        if (bgColor) previewElement.style.setProperty('background', bgColor);
        if (borderColor) previewElement.style.setProperty('border-left-color', borderColor);
        if (textColor) previewElement.style.setProperty('color', textColor);
      }
    });
  }

  @action
  async saveSettings() {
    this.saving = true;
    
    try {
      // Применяем настройки глобально
      this.updateGlobalStyles();
      this.showStatus('Настройки сохранены!', 'success');
    } catch (error) {
      this.showStatus('Ошибка сохранения настроек', 'error');
    } finally {
      this.saving = false;
    }
  }

  @action
  resetDefaults() {
    this.noteSettings = {
      note_bg_color: '#e8f4fd',
      note_border_color: '#1f8ce6',
      note_text_color: '#0c5aa6',
      info_bg_color: '#fff8e1',
      info_border_color: '#ff9800',
      info_text_color: '#e65100',
      warn_bg_color: '#fff3e0',
      warn_border_color: '#ff5722',
      warn_text_color: '#d84315',
      negative_bg_color: '#ffebee',
      negative_border_color: '#f44336',
      negative_text_color: '#c62828',
      positive_bg_color: '#e8f5e8',
      positive_border_color: '#4caf50',
      positive_text_color: '#2e7d32',
      caution_bg_color: '#fce4ec',
      caution_border_color: '#e91e63',
      caution_text_color: '#ad1457'
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
