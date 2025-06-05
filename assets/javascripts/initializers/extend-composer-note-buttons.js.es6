import { withPluginApi } from "discourse/lib/plugin-api";

function initializeNoteButtons(api) {
  api.onToolbarCreate(toolbar => {
    // Add individual note buttons to the extras group (the "..." menu)
    const noteTypes = [
      { type: 'note', label: 'N', title: 'Заметка', example: 'Обычная заметка' },
      { type: 'info', label: 'I', title: 'Информация', example: 'Полезная информация' },
      { type: 'warn', label: 'W', title: 'Предупреждение', example: 'Важное предупреждение' },
      { type: 'negative', label: '-', title: 'Негативно', example: 'Негативная информация' },
      { type: 'positive', label: '+', title: 'Позитивно', example: 'Позитивная информация' },
      { type: 'caution', label: 'C', title: 'Осторожно', example: 'Будьте осторожны' }
    ];

    noteTypes.forEach(noteType => {
      toolbar.addButton({
        id: `insert-note-${noteType.type}`,
        group: "extras",
        label: noteType.label,
        title: `${noteType.title}: [${noteType.type}]${noteType.example}[/${noteType.type}]`,
        condition: () => true,
        perform: () => insertNote(noteType.type, noteType.example, toolbar)
      });
    });
    
    console.log('[Markdown Notes] Note buttons added to extras menu');
  });
}

function insertNote(noteType, exampleText, toolbar) {
  try {
    const noteText = `[${noteType}]${exampleText}[/${noteType}]`;
    toolbar.applySurround('', '', noteText);
    console.log(`[Markdown Notes] Inserted ${noteType} note`);
  } catch (e) {
    console.error('[Markdown Notes] Error inserting note:', e);
    
    try {
      const textArea = document.querySelector('#reply-control .d-editor-input');
      if (textArea) {
        const startPos = textArea.selectionStart;
        const endPos = textArea.selectionEnd;
        const currentText = textArea.value;
        
        const newText = currentText.substring(0, startPos) + 
                       noteText + 
                       currentText.substring(endPos);
        
        textArea.value = newText;
        textArea.focus();
        
        const newCursorPos = startPos + noteText.length;
        textArea.setSelectionRange(newCursorPos, newCursorPos);
        
        textArea.dispatchEvent(new Event('input', { bubbles: true }));
        
        console.log(`[Markdown Notes] Fallback: Inserted ${noteType} note`);
      }
    } catch (fallbackError) {
      console.error('[Markdown Notes] Fallback also failed:', fallbackError);
    }
  }
}

export default {
  name: "extend-composer-note-buttons",
  initialize() {
    withPluginApi("0.8.31", initializeNoteButtons);
  }
};
