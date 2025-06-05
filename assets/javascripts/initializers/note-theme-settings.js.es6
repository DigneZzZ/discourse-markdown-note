import { withPluginApi } from "discourse/lib/plugin-api";

function initializeNoteThemeSettings(api) {  // Detect theme status more reliably
  function isDarkTheme() {
    const theme = document.documentElement.getAttribute('data-theme');
    const bodyClasses = document.body.className;
    const schemePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const discourseColorScheme = api.container.lookup('service:color-scheme');
    
    // Debug checks
    console.log('[Markdown Notes] Theme checks: ', {
      'data-theme': theme,
      'body-classes': bodyClasses.includes('dark-theme') || bodyClasses.includes('dark'),
      'prefers-dark': schemePreference,
      'discourse-scheme': discourseColorScheme && discourseColorScheme.isDark
    });
    
    // Check multiple conditions to detect dark theme with priority
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    if (bodyClasses.includes('dark-theme') || bodyClasses.includes('dark')) return true;
    if (discourseColorScheme && typeof discourseColorScheme.isDark === 'boolean') return discourseColorScheme.isDark;
    return schemePreference;
  }
  
  // Apply theme-based settings to CSS variables and display options
  function applyNoteStyles() {
    const siteSettings = api.container.lookup("site-settings:main");
    const dark = isDarkTheme();
    
    const root = document.documentElement;
    
    // Apply display options
    const showTitles = siteSettings.discourse_markdown_note_show_titles !== false;
    const showIcons = siteSettings.discourse_markdown_note_show_icons !== false;
    
    document.body.classList.toggle('hide-note-titles', !showTitles);
    document.body.classList.toggle('hide-note-icons', !showIcons);
    
    // Debug current theme status
    console.log('[Markdown Notes] Theme: ' + (dark ? 'Dark' : 'Light'));
    
    // Helper function to set CSS variables
    function setCSSVar(name, lightSetting, darkSetting, borderSetting = null) {
      const settingPrefix = 'discourse_markdown_note_';
      const bgSuffix = dark ? '_bg_dark' : '_bg_light';
      const textSuffix = dark ? '_text_dark' : '_text_light';
      
      const bgValue = siteSettings[settingPrefix + name + bgSuffix];
      const textValue = siteSettings[settingPrefix + name + textSuffix];
      const borderValue = borderSetting ? siteSettings[borderSetting] : null;
      
      root.style.setProperty(`--${name}-bg-color`, bgValue);
      root.style.setProperty(`--${name}-text-color`, textValue);
      if (borderValue) {
        root.style.setProperty(`--${name}-border-color`, borderValue);
      }
    }
    
    // Apply settings for each note type
    setCSSVar('note', 'note_bg_light', 'note_bg_dark', 'discourse_markdown_note_note_border');
    setCSSVar('info', 'info_bg_light', 'info_bg_dark', 'discourse_markdown_note_info_border');
    setCSSVar('warn', 'warn_bg_light', 'warn_bg_dark', 'discourse_markdown_note_warn_border');
    setCSSVar('negative', 'negative_bg_light', 'negative_bg_dark', 'discourse_markdown_note_negative_border');
    setCSSVar('positive', 'positive_bg_light', 'positive_bg_dark', 'discourse_markdown_note_positive_border');
    setCSSVar('caution', 'caution_bg_light', 'caution_bg_dark', 'discourse_markdown_note_caution_border');
  }
  
  // Apply styles on initialization
  applyNoteStyles();
    // Watch for theme changes
  const observer = new MutationObserver(function(mutations) {
    let shouldApplyStyles = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && 
          (mutation.attributeName === 'data-theme' || mutation.attributeName === 'class')) {
        shouldApplyStyles = true;
      }
    });
    
    if (shouldApplyStyles) {    // Delay application slightly to ensure all theme classes are applied
      // Apply multiple times to ensure changes are caught
      setTimeout(() => {
        applyNoteStyles();
        console.log('[Markdown Notes] Styles reapplied after theme change (first pass)');
        
        // Apply again after a longer delay for reliability
        setTimeout(() => {
          applyNoteStyles();
          console.log('[Markdown Notes] Styles reapplied after theme change (second pass)');
        }, 500);
      }, 50);
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
