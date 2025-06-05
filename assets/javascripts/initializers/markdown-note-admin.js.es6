// JavaScript для работы с административной панелью заметок
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "markdown-note-admin",

  initialize() {
    withPluginApi("0.8.31", api => {
      // Функция для динамического обновления CSS переменных
      function updateNoteColors(settings) {
        const root = document.documentElement;
        
        // Обновляем CSS переменные на основе настроек
        Object.keys(settings).forEach(key => {
          const cssVarName = `--${key.replace(/_/g, '-')}`;
          root.style.setProperty(cssVarName, settings[key]);
        });
      }

      // Функция для загрузки настроек из SiteSettings
      function loadNoteSettings() {
        const siteSettings = api.container.lookup("site-settings:main");
        
        const settings = {
          'note-bg-color': siteSettings.note_bg_color || '#e8f4fd',
          'note-border-color': siteSettings.note_border_color || '#1f8ce6',
          'note-text-color': siteSettings.note_text_color || '#0c5aa6',
          'info-bg-color': siteSettings.info_bg_color || '#fff8e1',
          'info-border-color': siteSettings.info_border_color || '#ff9800',
          'info-text-color': siteSettings.info_text_color || '#e65100',
          'warn-bg-color': siteSettings.warn_bg_color || '#fff3e0',
          'warn-border-color': siteSettings.warn_border_color || '#ff5722',
          'warn-text-color': siteSettings.warn_text_color || '#d84315',
          'negative-bg-color': siteSettings.negative_bg_color || '#ffebee',
          'negative-border-color': siteSettings.negative_border_color || '#f44336',
          'negative-text-color': siteSettings.negative_text_color || '#c62828',
          'positive-bg-color': siteSettings.positive_bg_color || '#e8f5e8',
          'positive-border-color': siteSettings.positive_border_color || '#4caf50',
          'positive-text-color': siteSettings.positive_text_color || '#2e7d32',
          'caution-bg-color': siteSettings.caution_bg_color || '#fce4ec',
          'caution-border-color': siteSettings.caution_border_color || '#e91e63',
          'caution-text-color': siteSettings.caution_text_color || '#ad1457'
        };

        updateNoteColors(settings);
      }

      // Загружаем настройки при инициализации
      api.onPageChange(() => {
        loadNoteSettings();
      });

      // Загружаем настройки сразу
      loadNoteSettings();
    });
  }
};
