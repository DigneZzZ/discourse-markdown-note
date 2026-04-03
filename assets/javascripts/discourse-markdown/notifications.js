// Note type constants and mappings
const NOTE_TYPES = ['note', 'info', 'warn', 'error', 'success', 'important', 'security', 'question'];
const LEGACY_TYPES = ['negative', 'positive', 'caution', 'attention', 'tip'];
const ALL_NOTE_TYPES = [...NOTE_TYPES, ...LEGACY_TYPES];

// Maps legacy type names to current types
const TYPE_MAPPINGS = {
  'note': 'note',
  'info': 'info',
  'warn': 'warn',
  'warning': 'warn',
  'error': 'error',
  'success': 'success',
  'important': 'important',
  'security': 'security',
  'question': 'question',
  // Legacy mappings
  'negative': 'error',
  'positive': 'success',
  'caution': 'important',
  'attention': 'important',
  'tip': 'info',
  'danger': 'error'
};

// Fallback status text (used when i18n is not available)
const FALLBACK_STATUS_TEXT = {
  'note': 'Note',
  'info': 'Info',
  'warn': 'Warning',
  'error': 'Error',
  'success': 'Success',
  'important': 'Important',
  'security': 'Security',
  'question': 'Question'
};

/**
 * Get localized status text for a note type
 * @param {string} type - The note type
 * @param {object} siteSettings - Site settings object (may contain translations)
 * @returns {string} - Localized status text
 */
function getStatusText(type, siteSettings) {
  const mappedType = TYPE_MAPPINGS[type] || 'note';
  
  // Try to get from I18n if available (client-side)
  if (typeof I18n !== 'undefined' && I18n.t) {
    try {
      const key = `js.note.${mappedType}_title`;
      const translated = I18n.t(key);
      // I18n returns the key itself if translation is missing
      if (translated && !translated.includes(key)) {
        return translated;
      }
    } catch (e) {
      // I18n not available, use fallback
    }
  }
  
  return FALLBACK_STATUS_TEXT[mappedType] || FALLBACK_STATUS_TEXT['note'];
}

/**
 * Creates note content in the markdown state
 * @param {object} state - Markdown-it state object
 * @param {string} noteType - Original note type from tag
 * @param {string} content - Note content
 * @param {object} options - Display options (showIcons, showTitles)
 */
function createNoteContent(state, noteType, content, options) {
  const { showIcons, showTitles, siteSettings } = options;
  const mappedType = TYPE_MAPPINGS[noteType] || 'note';
  const notificationClass = 'p-notification--' + mappedType;

  // Start wrapper elements with accessibility attributes
  const wrapperToken = state.push('div_open', 'div', 1);
  wrapperToken.attrSet('class', 'p-notification');
  wrapperToken.attrSet('role', 'note');
  
  state.push('div_open', 'div', 1).attrSet('class', notificationClass);
  state.push('div_open', 'div', 1).attrSet('class', 'p-notification__response');
  
  // Add icon span if enabled
  if (showIcons) {
    const iconToken = state.push('span_open', 'span', 1);
    iconToken.attrSet('class', 'p-notification__icon');
    iconToken.attrSet('aria-hidden', 'true');
    state.push('span_close', 'span', -1);
  }
  
  // Add status title if enabled
  if (showTitles) {
    state.push('span_open', 'span', 1).attrSet('class', 'p-notification__status');
    state.push('text', '', 0).content = getStatusText(noteType, siteSettings) + ': ';
    state.push('span_close', 'span', -1);
  }

  // Parse and add the note content
  try {
    const tokens = state.md.parse(content, state.env);
    tokens.forEach(element => {
      // Fix duplicate text issue: "inline" elements contain text in both
      // "content" property and as "text" child nodes
      if (element.type === "inline") {
        element.content = "";
      }
      state.tokens.push(element);
    });
  } catch (parseError) {
    // Fallback: add content as simple text
    state.push('text', '', 0).content = content;
  }

  // Close wrapper elements
  state.push('div_close', 'div', -1);
  state.push('div_close', 'div', -1);
  state.push('div_close', 'div', -1);

  return true;
}

export function setup(helper) {
  if (!helper.markdownIt) {
    return;
  }
  
  // Register allowed HTML elements
  helper.allowList([
    'div.p-notification',
    'div.p-notification[role=note]',
    ...NOTE_TYPES.map(type => `div.p-notification--${type}`),
    'div.p-notification__response',
    'span.p-notification__status',
    'span.p-notification__icon',
    'span.p-notification__icon[aria-hidden=true]'
  ]);

  helper.registerPlugin(md => {
    // Get site settings for display options
    let siteSettings = {};
    let showTitles = true;
    let showIcons = true;
    
    try {
      siteSettings = helper.getOption('siteSettings') || {};
      showTitles = siteSettings.discourse_markdown_note_show_titles !== false;
      showIcons = siteSettings.discourse_markdown_note_show_icons !== false;
    } catch (e) {
      // Use defaults if settings unavailable
    }
    
    const displayOptions = { showIcons, showTitles, siteSettings };

    // Register each note type as a BBCode tag
    ALL_NOTE_TYPES.forEach(noteType => {
      md.block.bbcode.ruler.push(noteType, {
        tag: noteType,
        replace: function(state, tagInfo, content) {
          return createNoteContent(state, noteType, content, displayOptions);
        }
      });
    });

    // Support for legacy [note type="..."] syntax
    md.block.bbcode.ruler.push('note-legacy', {
      tag: 'note',
      replace: function(state, tagInfo, content) {
        const attrs = tagInfo.attrs || {};
        const noteType = attrs.type || 'note';
        return createNoteContent(state, noteType, content, displayOptions);
      }
    });
  });
}
