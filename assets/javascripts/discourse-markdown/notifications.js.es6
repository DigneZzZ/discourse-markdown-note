export function setup(helper) {
  if (!helper.markdownIt) {
    return;
  }
  
  helper.allowList([
    'div.p-notification',
    'div.p-notification--note',
    'div.p-notification--info',
    'div.p-notification--warn',
    'div.p-notification--error',
    'div.p-notification--success',
    'div.p-notification--important',
    'div.p-notification--security',
    'div.p-notification--question',
    'div.p-notification__response',
    'span.p-notification__status',
    'span.p-notification__icon'
  ]);

  helper.registerPlugin(md => {
    // Define all supported note types (including legacy types)
    const noteTypes = ['note', 'info', 'warn', 'error', 'success', 'important', 'security', 'question', 'negative', 'positive', 'caution', 'attention', 'tip'];
      // Get site settings for display options
    let siteSettings = {};
    let showTitles = true;
    let showIcons = true;
    
    try {
      siteSettings = helper.getOption('siteSettings') || {};
      showTitles = siteSettings.discourse_markdown_note_show_titles !== false;
      showIcons = siteSettings.discourse_markdown_note_show_icons !== false;
    } catch (settingsError) {
      console.warn('[Markdown Notes] Could not get site settings, using defaults:', settingsError);
    }
    
    // Register each note type as a separate tag
    noteTypes.forEach(noteType => {
      md.block.bbcode.ruler.push(noteType, {
        tag: noteType,
        replace: function(state, tagInfo, content) {
          // Map tag names to CSS classes (with legacy mapping)
          const typeMapping = {
            'note': 'note',
            'info': 'info', 
            'warn': 'warn',
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
            'tip': 'info'
          };
          
          let notificationClass = 'p-notification--' + typeMapping[noteType];

          // Start wrapper elements:
          // <div class="p-notification"><div class="p-notification__response">
          state.push('div_open', 'div', 1).attrSet('class', 'p-notification');
          state.push('div_open', 'div', 1).attrSet('class', notificationClass);
          state.push('div_open', 'div', 1).attrSet('class', 'p-notification__response');
          
          // Add icon span if enabled
          if (showIcons) {
            state.push('span_open', 'span', 1).attrSet('class', 'p-notification__icon');
            state.push('span_close', 'span', -1);
          }
          
          // Add status based on note type if enabled
          if (showTitles) {
            state.push('span_open', 'span', 1).attrSet('class', 'p-notification__status');
            const statusText = {
              'note': 'Заметка',
              'info': 'Информация', 
              'warn': 'Предупреждение',
              'error': 'Ошибка',
              'success': 'Успех',
              'important': 'Важно',
              'security': 'Безопасность',
              'question': 'Вопрос',
              // Legacy mappings - show as new types
              'negative': 'Ошибка',
              'positive': 'Успех',
              'caution': 'Важно',
              'attention': 'Важно',
              'tip': 'Информация'
            };
            state.push('text', '', 0).content = statusText[noteType] + ': ';
            state.push('span_close', 'span', -1);
          }          // Add the [note] content
          try {
            const tokens = state.md.parse(content, state.env);
            tokens.forEach(element => {
              // For some reason, "inline" elements contain their text twice,
              // which duplicates the text on the page.
              // This is because the text appears both inside the "content" of the inline block,
              // and in a "text" child node of the block.
              // We therefore strip the "content", so the text only appears once.
              if (element.type == "inline") {
                element.content = ""
              }
              state.tokens.push(element)
            });
          } catch (parseError) {
            console.error('[Markdown Notes] Error parsing note content:', parseError);
            // Fallback: add content as simple text
            state.push('text', '', 0).content = content;
          }
            // Close the wrapper elements
          state.push('div_close', 'div', -1);
          state.push('div_close', 'div', -1);
          state.push('div_close', 'div', -1);

          return true;
        }      });
    });    // Support for legacy [note type=""] syntax
    md.block.bbcode.ruler.push('note-legacy', {
      tag: 'note',
      replace: function(state, tagInfo, content) {
        const attrs = tagInfo.attrs || {};
        const noteType = attrs.type || 'note';
        
        // Map legacy type names to new format
        const legacyMapping = {
          'info': 'info',
          'tip': 'info', // tip is now a synonym for info
          'warn': 'warn', 
          'warning': 'warn',
          'error': 'error',
          'negative': 'error', // renamed negative to error
          'success': 'success',
          'positive': 'success', // renamed positive to success
          'danger': 'error',
          'important': 'important',
          'caution': 'important', // renamed caution to important
          'attention': 'important', // attention maps to important
          'security': 'security',
          'question': 'question'
        };

        const mappedType = legacyMapping[noteType] || 'note';
        let notificationClass = 'p-notification--' + mappedType;

        // Start wrapper elements
        state.push('div_open', 'div', 1).attrSet('class', 'p-notification');
        state.push('div_open', 'div', 1).attrSet('class', notificationClass);
        state.push('div_open', 'div', 1).attrSet('class', 'p-notification__response');
        
        // Add icon span if enabled
        if (showIcons) {
          state.push('span_open', 'span', 1).attrSet('class', 'p-notification__icon');
          state.push('span_close', 'span', -1);
        }
        
        // Add status based on note type if enabled
        if (showTitles) {
          state.push('span_open', 'span', 1).attrSet('class', 'p-notification__status');
          const statusText = {
            'note': 'Заметка',
            'info': 'Информация', 
            'warn': 'Предупреждение',
            'error': 'Ошибка',
            'success': 'Успех',
            'important': 'Важно',
            'security': 'Безопасность',
            'question': 'Вопрос'
          };
          state.push('text', '', 0).content = (statusText[mappedType] || 'Заметка') + ': ';
          state.push('span_close', 'span', -1);
        }        // Add the note content
        try {
          const tokens = state.md.parse(content, state.env);
          tokens.forEach(element => {
            if (element.type == "inline") {
              element.content = ""
            }
            state.tokens.push(element)
          });
        } catch (parseError) {
          console.error('[Markdown Notes] Error parsing legacy note content:', parseError);
          // Fallback: add content as simple text
          state.push('text', '', 0).content = content;
        }
        
        // Close the wrapper elements
        state.push('div_close', 'div', -1);
        state.push('div_close', 'div', -1);
        state.push('div_close', 'div', -1);

        return true;
      }
    });
  });
}
