import { withPluginApi } from "discourse/lib/plugin-api";

function initializeNoteThemeSettings(api) {
  // Apply theme-based settings to CSS variables and display options
  function applyNoteStyles() {
    const siteSettings = api.container.lookup("site-settings:main");
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
                   document.body.classList.contains('dark-theme') ||
                   document.body.classList.contains('dark');
    
    const root = document.documentElement;
    
    // Apply display options
    const showTitles = siteSettings.discourse_markdown_note_show_titles !== false;
    const showIcons = siteSettings.discourse_markdown_note_show_icons !== false;
    
    document.body.classList.toggle('hide-note-titles', !showTitles);
    document.body.classList.toggle('hide-note-icons', !showIcons);
    
    // Helper function to set CSS variables
    function setCSSVar(name, lightSetting, darkSetting, borderSetting = null) {
      const bgValue = isDark ? 
        siteSettings[`discourse_markdown_note_${name}_bg_dark`] :
        siteSettings[`discourse_markdown_note_${name}_bg_light`];
      
      const textValue = isDark ?
        siteSettings[`discourse_markdown_note_${name}_text_dark`] :
        siteSettings[`discourse_markdown_note_${name}_text_light`];
      
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
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && 
          (mutation.attributeName === 'data-theme' || mutation.attributeName === 'class')) {
        applyNoteStyles();
      }
    });
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
  
  // Also apply when site settings change
  api.onPageChange(() => {
    applyNoteStyles();
  });
}

export default {
  name: "note-theme-settings",
  initialize(container) {
    withPluginApi("0.8.31", initializeNoteThemeSettings);
  }
};
