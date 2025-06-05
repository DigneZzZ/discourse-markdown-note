import { withPluginApi } from "discourse/lib/plugin-api";
import { iconHTML } from "discourse-common/lib/icon-library";

function initializeNoteButtons(api) {
  api.onToolbarCreate(toolbar => {
    // Add note buttons group
    toolbar.addButton({
      id: "note-dropdown",
      group: "extras",
      icon: "sticky-note",
      title: "note.composer_title",
      perform: (e) => showNoteDropdown(e, toolbar)
    });
  });
}

function showNoteDropdown(e, toolbar) {
  const noteTypes = [
    { type: 'note', icon: 'sticky-note', title: 'Заметка', color: '#6c757d' },
    { type: 'info', icon: 'info-circle', title: 'Информация', color: '#2196f3' },
    { type: 'warn', icon: 'exclamation-triangle', title: 'Предупреждение', color: '#ff9800' },
    { type: 'negative', icon: 'times-circle', title: 'Внимание', color: '#f44336' },
    { type: 'positive', icon: 'check-circle', title: 'Успех', color: '#4caf50' },
    { type: 'caution', icon: 'exclamation-circle', title: 'Осторожно', color: '#e91e63' }
  ];

  // Create dropdown menu
  const dropdown = document.createElement('div');
  dropdown.className = 'note-types-dropdown';
  dropdown.style.cssText = `
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--primary-very-low);
    border: 1px solid var(--primary-low);
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    min-width: 200px;
    padding: 8px 0;
    margin-top: 4px;
  `;

  noteTypes.forEach(noteType => {
    const button = document.createElement('button');
    button.className = 'note-type-button';
    button.style.cssText = `
      width: 100%;
      padding: 8px 16px;
      border: none;
      background: transparent;
      color: var(--primary);
      text-align: left;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: background-color 0.2s;
    `;
    
    button.innerHTML = `
      <span style="color: ${noteType.color};">${iconHTML(noteType.icon)}</span>
      <span>${noteType.title}</span>
    `;
    
    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = 'var(--primary-very-low)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = 'transparent';
    });
    
    button.addEventListener('click', () => {
      insertNoteTag(toolbar, noteType.type);
      dropdown.remove();
    });
    
    dropdown.appendChild(button);
  });

  // Position dropdown relative to button
  const buttonElement = e.target.closest('.d-editor-button-bar button');
  if (buttonElement) {
    buttonElement.style.position = 'relative';
    buttonElement.appendChild(dropdown);
    
    // Close dropdown when clicking outside
    const closeDropdown = (event) => {
      if (!dropdown.contains(event.target) && !buttonElement.contains(event.target)) {
        dropdown.remove();
        document.removeEventListener('click', closeDropdown);
      }
    };
    
    setTimeout(() => {
      document.addEventListener('click', closeDropdown);
    }, 0);
  }
}

function insertNoteTag(toolbar, noteType) {
  const selected = toolbar.getSelected();
  const text = selected.value || `Введите текст ${noteType} здесь`;
  
  const beforeSelection = `[${noteType}]\n`;
  const afterSelection = `\n[/${noteType}]`;
  
  toolbar.applySurround(beforeSelection, afterSelection, text);
}

export default {
  name: "extend-composer-note-buttons",
  
  initialize() {
    withPluginApi("0.8.31", initializeNoteButtons);
  }
};
