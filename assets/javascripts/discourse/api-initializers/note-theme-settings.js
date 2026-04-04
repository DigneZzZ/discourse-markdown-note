import { apiInitializer } from "discourse/lib/api";

function isDarkTheme() {
  const htmlTheme = document.documentElement.getAttribute('data-theme');
  if (htmlTheme === 'dark') return true;
  if (htmlTheme === 'light') return false;

  if (document.documentElement.classList.contains('discourse-dark')) return true;

  if (document.body.classList.contains('dark-theme') ||
      document.body.classList.contains('dark') ||
      document.body.classList.contains('discourse-dark')) {
    return true;
  }

  const htmlClasses = document.documentElement.className;
  if (htmlClasses.includes('color-scheme-dark') ||
      htmlClasses.includes('dark-mode') ||
      htmlClasses.includes('d-dark-mode')) {
    return true;
  }

  try {
    const computedStyle = getComputedStyle(document.documentElement);
    const bgColor = computedStyle.getPropertyValue('--secondary').trim();
    if (bgColor && (bgColor.includes('#1') || bgColor.includes('#2') || bgColor.includes('#3'))) {
      return true;
    }
  } catch (e) {
    // Ignore CSS property check errors
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true;
  }

  return false;
}

export default apiInitializer("0.8.31", (api) => {
  function getSiteSettings() {
    try {
      return api.container.lookup("service:site-settings");
    } catch (e) {
      return {};
    }
  }

  function getThemeMode() {
    try {
      const siteSettings = getSiteSettings();
      const themeMode = siteSettings.discourse_markdown_note_theme_mode || 'auto';

      if (themeMode === 'light') return 'light';
      if (themeMode === 'dark') return 'dark';

      return isDarkTheme() ? 'dark' : 'light';
    } catch (e) {
      return isDarkTheme() ? 'dark' : 'light';
    }
  }

  const NOTE_TYPES = ['note', 'info', 'warn', 'error', 'success', 'important', 'security', 'question'];

  function setCSSVar(type) {
    try {
      const siteSettings = getSiteSettings();
      const theme = getThemeMode();

      const lightBg = siteSettings[`discourse_markdown_note_${type}_bg_light`] || '';
      const darkBg = siteSettings[`discourse_markdown_note_${type}_bg_dark`] || '';
      const borderColor = siteSettings[`discourse_markdown_note_${type}_border`] || '';
      const lightText = siteSettings[`discourse_markdown_note_${type}_text_light`] || '';
      const darkText = siteSettings[`discourse_markdown_note_${type}_text_dark`] || '';

      const currentBg = theme === 'dark' ? darkBg : lightBg;
      const currentText = theme === 'dark' ? darkText : lightText;

      if (currentBg) {
        document.documentElement.style.setProperty(`--note-${type}-bg`, currentBg);
      }
      if (borderColor) {
        document.documentElement.style.setProperty(`--note-${type}-border`, borderColor);
      }
      if (currentText) {
        document.documentElement.style.setProperty(`--note-${type}-text`, currentText);
      }
    } catch (e) {
      // Silently fail
    }
  }

  function applyNoteStyles() {
    try {
      const siteSettings = getSiteSettings();
      const theme = getThemeMode();

      document.body.setAttribute('data-note-theme', theme);

      const showTitles = siteSettings.discourse_markdown_note_show_titles !== false;
      const showIcons = siteSettings.discourse_markdown_note_show_icons !== false;

      document.body.classList.toggle('hide-note-titles', !showTitles);
      document.body.classList.toggle('hide-note-icons', !showIcons);

      NOTE_TYPES.forEach(setCSSVar);
    } catch (e) {
      // Silently fail
    }
  }

  let styleUpdateTimeout = null;

  function scheduleStyleUpdate() {
    if (styleUpdateTimeout) {
      clearTimeout(styleUpdateTimeout);
    }
    styleUpdateTimeout = setTimeout(() => {
      applyNoteStyles();
      styleUpdateTimeout = null;
    }, 100);
  }

  applyNoteStyles();

  const observer = new MutationObserver(mutations => {
    const shouldUpdate = mutations.some(mutation => {
      if (mutation.type !== 'attributes') return false;

      const attrName = mutation.attributeName;
      const target = mutation.target;

      return (attrName === 'data-theme' && target === document.documentElement) ||
             (attrName === 'class' && (target === document.documentElement || target === document.body));
    });

    if (shouldUpdate) {
      scheduleStyleUpdate();
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'class']
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });

  api.onPageChange(() => scheduleStyleUpdate());

  const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
  colorSchemeMedia.addEventListener('change', () => scheduleStyleUpdate());

  if (api.onAppEvent) {
    api.onAppEvent('theme:changed', scheduleStyleUpdate);
    api.onAppEvent('discourse-theme:changed', scheduleStyleUpdate);
  }

  window.addEventListener('focus', scheduleStyleUpdate);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleStyleUpdate);
  }
});
