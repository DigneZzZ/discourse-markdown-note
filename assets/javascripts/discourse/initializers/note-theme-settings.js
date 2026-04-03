import { withPluginApi } from "discourse/lib/plugin-api";

// Debug mode - set to true for development
const DEBUG = false;

function debugLog(...args) {
  if (DEBUG) {
    console.log('[Markdown Notes]', ...args);
  }
}

function initializeNoteThemeSettings(api) {
  // Helper function to safely get site settings
  function getSiteSettings() {
    try {
      return api.container.lookup("site-settings:main");
    } catch (e) {
      return {};
    }
  }

  // Comprehensive dark theme detection for Discourse
  function isDarkTheme() {
    // Method 1: Check data-theme attribute on html element
    const htmlTheme = document.documentElement.getAttribute('data-theme');
    if (htmlTheme === 'dark') return true;
    if (htmlTheme === 'light') return false;
    
    // Method 2: Check for discourse-dark class
    if (document.documentElement.classList.contains('discourse-dark')) return true;
    
    // Method 3: Check body classes
    if (document.body.classList.contains('dark-theme') || 
        document.body.classList.contains('dark') ||
        document.body.classList.contains('discourse-dark')) {
      return true;
    }
    
    // Method 4: Check for color scheme class patterns
    const htmlClasses = document.documentElement.className;
    if (htmlClasses.includes('color-scheme-dark') || 
        htmlClasses.includes('dark-mode') ||
        htmlClasses.includes('d-dark-mode')) {
      return true;
    }
    
    // Method 5: Check CSS custom properties
    try {
      const computedStyle = getComputedStyle(document.documentElement);
      const bgColor = computedStyle.getPropertyValue('--secondary').trim();
      if (bgColor && (bgColor.includes('#1') || bgColor.includes('#2') || bgColor.includes('#3'))) {
        return true;
      }
    } catch (e) {
      // Ignore CSS property check errors
    }
    
    // Method 6: Check prefers-color-scheme as fallback
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
    
    return false;
  }

  // Get theme mode based on user setting
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

  // Note types to apply styles for
  const NOTE_TYPES = ['note', 'info', 'warn', 'error', 'success', 'important', 'security', 'question'];

  // Helper function to set CSS variables for a note type
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
      
      debugLog(`Applied ${theme} theme for ${type}`);
    } catch (e) {
      // Silently fail
    }
  }

  // Apply theme-based settings to CSS variables and display options
  function applyNoteStyles() {
    try {
      const siteSettings = getSiteSettings();
      const theme = getThemeMode();
      
      // Set theme data attribute
      document.body.setAttribute('data-note-theme', theme);
      
      // Apply display options
      const showTitles = siteSettings.discourse_markdown_note_show_titles !== false;
      const showIcons = siteSettings.discourse_markdown_note_show_icons !== false;
      
      document.body.classList.toggle('hide-note-titles', !showTitles);
      document.body.classList.toggle('hide-note-icons', !showIcons);
      
      // Apply settings for each note type
      NOTE_TYPES.forEach(setCSSVar);
      
      debugLog(`Applied ${theme} theme styles`);
    } catch (e) {
      // Silently fail
    }
  }

  // Debounced style update
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

  // Apply styles on initialization
  applyNoteStyles();

  // MutationObserver for theme changes
  const observer = new MutationObserver(mutations => {
    const shouldUpdate = mutations.some(mutation => {
      if (mutation.type !== 'attributes') return false;
      
      const attrName = mutation.attributeName;
      const target = mutation.target;
      
      return (attrName === 'data-theme' && target === document.documentElement) ||
             (attrName === 'class' && (target === document.documentElement || target === document.body));
    });
    
    if (shouldUpdate) {
      debugLog('Theme change detected');
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

  // Listen for page changes
  api.onPageChange(() => scheduleStyleUpdate());
  
  // Listen for system color scheme changes
  const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
  const handleColorSchemeChange = () => scheduleStyleUpdate();
  
  try {
    colorSchemeMedia.addEventListener('change', handleColorSchemeChange);
  } catch (e) {
    // Fallback for older browsers
    colorSchemeMedia.addListener(handleColorSchemeChange);
  }
  
  // Listen for Discourse app events
  if (api.onAppEvent) {
    api.onAppEvent('theme:changed', scheduleStyleUpdate);
    api.onAppEvent('discourse-theme:changed', scheduleStyleUpdate);
  }
  
  // Apply styles when window gains focus
  window.addEventListener('focus', scheduleStyleUpdate);
  
  // Apply styles when DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleStyleUpdate);
  }
}

export default {
  name: "note-theme-settings",
  initialize() {
    withPluginApi("0.8.31", initializeNoteThemeSettings);
  }
};
