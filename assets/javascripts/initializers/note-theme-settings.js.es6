import { withPluginApi } from "discourse/lib/plugin-api";

function initializeNoteThemeSettings(api) {
  // Simplified theme detection
  function isDarkTheme() {
    const theme = document.documentElement.getAttribute('data-theme');
    
    // Check based on simple data-theme attribute
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    
    // Fallback to body class check
    if (document.body.classList.contains('dark-theme') || 
        document.body.classList.contains('dark')) {
      return true;
    }
    
    // Default to light theme
    return false;
  }

  // Helper function to set CSS variables
  function setCSSVar(type, lightBgSetting, darkBgSetting, borderSetting) {
    try {
      const siteSettings = api.container.lookup("site-settings:main");
      const dark = isDarkTheme();
      
      // Get background colors
      const lightBg = siteSettings[`discourse_markdown_note_${lightBgSetting}`] || '';
      const darkBg = siteSettings[`discourse_markdown_note_${darkBgSetting}`] || '';
      const borderColor = siteSettings[borderSetting] || '';
      
      // Apply appropriate background
      const currentBg = dark ? darkBg : lightBg;
      if (currentBg) {
        document.documentElement.style.setProperty(`--note-${type}-bg`, currentBg);
      }
      
      // Apply border color
      if (borderColor) {
        document.documentElement.style.setProperty(`--note-${type}-border`, borderColor);
      }
    } catch (e) {
      console.error(`[Markdown Notes] Error setting CSS vars for ${type}:`, e);
    }
  }

  // Apply theme-based settings to CSS variables and display options
  function applyNoteStyles() {
    try {
      const siteSettings = api.container.lookup("site-settings:main");
      const dark = isDarkTheme();
      
      // Keep track of current theme with a data attribute
      document.body.setAttribute('data-note-theme', dark ? 'dark' : 'light');
      
      // Apply display options
      const showTitles = siteSettings.discourse_markdown_note_show_titles !== false;
      const showIcons = siteSettings.discourse_markdown_note_show_icons !== false;
      
      document.body.classList.toggle('hide-note-titles', !showTitles);
      document.body.classList.toggle('hide-note-icons', !showIcons);
      
      // Apply settings for each note type
      setCSSVar('note', 'note_bg_light', 'note_bg_dark', 'discourse_markdown_note_note_border');
      setCSSVar('info', 'info_bg_light', 'info_bg_dark', 'discourse_markdown_note_info_border');
      setCSSVar('warn', 'warn_bg_light', 'warn_bg_dark', 'discourse_markdown_note_warn_border');
      setCSSVar('negative', 'negative_bg_light', 'negative_bg_dark', 'discourse_markdown_note_negative_border');
      setCSSVar('positive', 'positive_bg_light', 'positive_bg_dark', 'discourse_markdown_note_positive_border');
      setCSSVar('caution', 'caution_bg_light', 'caution_bg_dark', 'discourse_markdown_note_caution_border');
    } catch (e) {
      console.error('[Markdown Notes] Error applying note styles:', e);
    }
  }
  
  // Apply styles on initialization
  applyNoteStyles();
  
  // Watch for theme changes with improved logic
  const observer = new MutationObserver(function(mutations) {
    let shouldApplyStyles = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && 
          (mutation.attributeName === 'data-theme' || mutation.attributeName === 'class')) {
        shouldApplyStyles = true;
      }
    });
    
    if (shouldApplyStyles) {
      // Apply styles multiple times with increasing delays to ensure proper application
      console.log('[Markdown Notes] Theme change detected, reapplying styles');
      
      // First immediate application
      applyNoteStyles();
      
      // Then a sequence of delayed applications to catch any race conditions
      [50, 200, 500, 1000].forEach(delay => {
        setTimeout(() => {
          applyNoteStyles();
          console.log(`[Markdown Notes] Styles reapplied after ${delay}ms`);
        }, delay);
      });
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
  
  // Also apply when site settings change or page changes
  api.onPageChange(() => {
    applyNoteStyles();
  });
  
  // Listen for color scheme changes
  const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Use the appropriate event listener based on browser support
  try {
    colorSchemeMedia.addEventListener('change', () => {
      applyNoteStyles();
      console.log('[Markdown Notes] System color scheme changed (addEventListener)');
    });
  } catch (e) {
    // Fallback for older browsers
    colorSchemeMedia.addListener(() => {
      applyNoteStyles();
      console.log('[Markdown Notes] System color scheme changed (addListener)');
    });
  }
  
  // Force applying styles when discourse theme changes
  api.onAppEvent('discourse-theme:changed', () => {
    console.log('[Markdown Notes] Discourse theme changed event');
    setTimeout(applyNoteStyles, 100);
  });
  
  // Apply styles when the window gains focus
  window.addEventListener('focus', () => {
    setTimeout(applyNoteStyles, 250);
  });
}

export default {
  name: "note-theme-settings",
  initialize(container) {
    withPluginApi("0.8.31", initializeNoteThemeSettings);
  }
};
