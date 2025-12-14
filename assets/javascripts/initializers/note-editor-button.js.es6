import { withPluginApi } from "discourse/lib/plugin-api";

const NOTE_TYPES = [
  { id: 'note', icon: '📝', label: 'note_title' },
  { id: 'info', icon: '💡', label: 'info_title' },
  { id: 'warn', icon: '⚠️', label: 'warn_title' },
  { id: 'error', icon: '❌', label: 'error_title' },
  { id: 'success', icon: '✅', label: 'success_title' },
  { id: 'important', icon: '🔥', label: 'important_title' },
  { id: 'security', icon: '🔒', label: 'security_title' },
  { id: 'question', icon: '❓', label: 'question_title' }
];

function initializeNoteEditorButton(api) {
  api.onToolbarCreate((toolbar) => {
    toolbar.addButton({
      id: "note-insert",
      group: "extras",
      icon: "file-alt",
      className: "note-insert-btn",
      title: "note.composer_title",
      perform: (toolbarEvent) => {
        showNoteDropdown(toolbarEvent);
      }
    });
  });
}

function showNoteDropdown(toolbarEvent) {
  // Remove existing dropdown if present
  const existingDropdown = document.querySelector('.note-types-dropdown');
  if (existingDropdown) {
    existingDropdown.remove();
    return;
  }

  // Find the button to position dropdown - try multiple selectors
  const button = document.querySelector('.d-editor-button-bar .note-insert-btn')
    || document.querySelector('button.note-insert-btn')
    || document.querySelector('button[title*="заметку"]')
    || document.querySelector('button[title*="note"]');
  
  if (!button) {
    // Fallback: just insert a default note
    insertNoteTag(toolbarEvent, 'note');
    return;
  }

  const rect = button.getBoundingClientRect();
  
  // Create dropdown
  const dropdown = document.createElement('div');
  dropdown.className = 'note-types-dropdown';
  dropdown.style.position = 'fixed';
  dropdown.style.top = `${rect.bottom + 4}px`;
  dropdown.style.left = `${rect.left}px`;
  dropdown.style.zIndex = '9999';

  // Add note type buttons
  NOTE_TYPES.forEach(noteType => {
    const btn = document.createElement('button');
    btn.className = 'note-type-button';
    btn.type = 'button';
    
    const icon = document.createElement('span');
    icon.className = 'note-icon';
    icon.textContent = noteType.icon;
    
    const label = document.createElement('span');
    label.className = 'note-label';
    label.textContent = I18n.t(`note.${noteType.label}`, { defaultValue: noteType.id });
    
    const tag = document.createElement('span');
    tag.className = 'note-tag';
    tag.textContent = `[${noteType.id}]`;
    
    btn.appendChild(icon);
    btn.appendChild(label);
    btn.appendChild(tag);
    
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      insertNoteTag(toolbarEvent, noteType.id);
      dropdown.remove();
    });
    
    dropdown.appendChild(btn);
  });

  document.body.appendChild(dropdown);

  // Close dropdown when clicking outside
  const closeHandler = (e) => {
    if (!dropdown.contains(e.target) && e.target !== button) {
      dropdown.remove();
      document.removeEventListener('click', closeHandler);
    }
  };
  
  // Delay adding the listener to avoid immediate close
  setTimeout(() => {
    document.addEventListener('click', closeHandler);
  }, 10);
  
  // Close on escape
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      dropdown.remove();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}

function insertNoteTag(toolbarEvent, noteType) {
  const selected = toolbarEvent.selected || "";
  
  if (selected) {
    // Wrap selected text
    toolbarEvent.addText(`[${noteType}]\n${selected}\n[/${noteType}]`);
  } else {
    // Insert empty note with placeholder
    const placeholder = I18n.t("note.composer_placeholder", { defaultValue: "Your text here" });
    toolbarEvent.addText(`[${noteType}]\n${placeholder}\n[/${noteType}]`);
    
    // Try to select the placeholder for easy replacement
    const textarea = document.querySelector('.d-editor-input');
    if (textarea) {
      const cursorPos = textarea.selectionStart;
      const noteLength = `[${noteType}]\n`.length;
      const start = cursorPos - `[/${noteType}]`.length - 1 - placeholder.length;
      const end = start + placeholder.length;
      
      setTimeout(() => {
        textarea.setSelectionRange(start, end);
        textarea.focus();
      }, 10);
    }
  }
}

export default {
  name: "note-editor-button",
  initialize() {
    withPluginApi("0.8.31", initializeNoteEditorButton);
  }
};
