import { withPluginApi } from "discourse/lib/plugin-api";

function initializeNoteThemeSettings(api) {  // Helper function to safely get site settings
  function getSiteSettings() {
    try {
      return api.container.lookup("site-settings:main");
    } catch (e) {
      console.warn('[Markdown Notes] Could not get site settings:', e);
      return {};
    }
  }

  // Improved theme detection based on user setting
  function getThemeMode() {
    try {
      const siteSettings = getSiteSettings();
      const themeMode = siteSettings.discourse_markdown_note_theme_mode || 'auto';
      
      if (themeMode === 'light') return 'light';
      if (themeMode === 'dark') return 'dark';
      
      // Auto mode - detect from Discourse using multiple methods
      return isDarkTheme() ? 'dark' : 'light';
    } catch (e) {
      console.error('[Markdown Notes] Error detecting theme mode:', e);
      return isDarkTheme() ? 'dark' : 'light';
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
    
    // Method 5: Check CSS custom properties (if available)
    try {
      const computedStyle = getComputedStyle(document.documentElement);
      const bgColor = computedStyle.getPropertyValue('--secondary').trim();
      // Dark themes typically have dark secondary colors
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
    
    // Default to light theme
    return false;
  }  // Helper function to set CSS variables
  function setCSSVar(type, lightBgSetting, darkBgSetting, borderSetting) {
    try {
      const siteSettings = getSiteSettings();
      const theme = getThemeMode();
      
      // Get background colors
      const lightBg = siteSettings[`discourse_markdown_note_${lightBgSetting}`] || '';
      const darkBg = siteSettings[`discourse_markdown_note_${darkBgSetting}`] || '';
      const borderColor = siteSettings[borderSetting] || '';
      
      // Apply appropriate background
      const currentBg = theme === 'dark' ? darkBg : lightBg;
      if (currentBg) {
        document.documentElement.style.setProperty(`--note-${type}-bg`, currentBg);
      }
      
      // Apply border color
      if (borderColor) {
        document.documentElement.style.setProperty(`--note-${type}-border`, borderColor);
      }
      
      // Apply text colors based on theme
      const lightTextSetting = `discourse_markdown_note_${type}_text_light`;
      const darkTextSetting = `discourse_markdown_note_${type}_text_dark`;
      const lightText = siteSettings[lightTextSetting] || '';
      const darkText = siteSettings[darkTextSetting] || '';
      
      const currentText = theme === 'dark' ? darkText : lightText;
      if (currentText) {
        document.documentElement.style.setProperty(`--note-${type}-text`, currentText);
      }
      
      console.log(`[Markdown Notes] Applied ${theme} theme for ${type} - BG: ${currentBg ? 'custom' : 'default'}, Text: ${currentText ? 'custom' : 'default'}`);
    } catch (e) {
      console.error(`[Markdown Notes] Error setting CSS vars for ${type}:`, e);
    }
  }  // Apply theme-based settings to CSS variables and display options
  function applyNoteStyles() {
    try {
      const siteSettings = getSiteSettings();
      const theme = getThemeMode();
      
      // Keep track of current theme with a data attribute
      document.body.setAttribute('data-note-theme', theme);
      
      // Apply display options
      const showTitles = siteSettings.discourse_markdown_note_show_titles !== false;
      const showIcons = siteSettings.discourse_markdown_note_show_icons !== false;
      
      document.body.classList.toggle('hide-note-titles', !showTitles);
      document.body.classList.toggle('hide-note-icons', !showIcons);
      
      // Apply settings for each note type (optimized set)
      setCSSVar('note', 'note_bg_light', 'note_bg_dark', 'discourse_markdown_note_note_border');
      setCSSVar('info', 'info_bg_light', 'info_bg_dark', 'discourse_markdown_note_info_border');
      setCSSVar('warn', 'warn_bg_light', 'warn_bg_dark', 'discourse_markdown_note_warn_border');
      setCSSVar('error', 'error_bg_light', 'error_bg_dark', 'discourse_markdown_note_error_border');
      setCSSVar('success', 'success_bg_light', 'success_bg_dark', 'discourse_markdown_note_success_border');
      setCSSVar('important', 'important_bg_light', 'important_bg_dark', 'discourse_markdown_note_important_border');
      setCSSVar('security', 'security_bg_light', 'security_bg_dark', 'discourse_markdown_note_security_border');
      setCSSVar('question', 'question_bg_light', 'question_bg_dark', 'discourse_markdown_note_question_border');
      
      console.log(`[Markdown Notes] Applied ${theme} theme styles (Dark: ${isDarkTheme()})`);
    } catch (e) {
      console.error('[Markdown Notes] Error applying note styles:', e);
    }
  }  
  // Apply styles on initialization
  applyNoteStyles();
  // Enhanced event handling for theme changes
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

  const observer = new MutationObserver(function(mutations) {
    let shouldApplyStyles = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes') {
        const attrName = mutation.attributeName;
        const target = mutation.target;
        
        // Check for theme-related attribute changes
        if ((attrName === 'data-theme' && target === document.documentElement) ||
            (attrName === 'class' && (target === document.documentElement || target === document.body))) {
          shouldApplyStyles = true;
        }
      }
    });
    
    if (shouldApplyStyles) {
      console.log('[Markdown Notes] Theme change detected via MutationObserver');
      scheduleStyleUpdate();
    }
  });

  // Observe changes to document element and body
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'class']
  });
  
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });
  // Listen for Discourse-specific theme events
  api.onPageChange(() => {
    scheduleStyleUpdate();
  });
  
  // Listen for system color scheme changes
  const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
  try {
    colorSchemeMedia.addEventListener('change', () => {
      console.log('[Markdown Notes] System color scheme changed');
      scheduleStyleUpdate();
    });
  } catch (e) {
    // Fallback for older browsers
    colorSchemeMedia.addListener(() => {
      console.log('[Markdown Notes] System color scheme changed (fallback)');
      scheduleStyleUpdate();
    });
  }
  
  // Listen for Discourse app events
  if (api.onAppEvent) {
    api.onAppEvent('theme:changed', () => {
      console.log('[Markdown Notes] Discourse theme changed event');
      scheduleStyleUpdate();
    });
    
    api.onAppEvent('discourse-theme:changed', () => {
      console.log('[Markdown Notes] Discourse theme changed event (legacy)');
      scheduleStyleUpdate();
    });
  }
  
  // Apply styles when window gains focus (for external theme changes)
  window.addEventListener('focus', () => {
    scheduleStyleUpdate();
  });
  
  // Apply styles when DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      scheduleStyleUpdate();
    });
  }
}

export default {
  name: "note-theme-settings",
  initialize(container) {
    withPluginApi("0.8.31", initializeNoteThemeSettings);
  }
};
