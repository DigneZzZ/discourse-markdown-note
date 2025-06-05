import { withPluginApi } from "discourse/lib/plugin-api";
import { iconHTML } from "discourse-common/lib/icon-library";

function initializeNoteButtons(api) {
  api.onToolbarCreate(toolbar => {
    // Add note button to the main toolbar
    toolbar.addButton({
      id: "insert-note",
      group: "fontStyles", // Put it with other formatting buttons
      icon: "sticky-note",
      title: "note.composer_title",
      condition: () => true,
      perform: (e) => showNoteDropdown(e, toolbar)
    });
  });
}

function showNoteDropdown(e, toolbar) {
  // Remove existing dropdown if any
  const existingDropdown = document.querySelector('.note-types-dropdown');
  if (existingDropdown) {
    existingDropdown.remove();
    return;
  }

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
    position: fixed;
    background: var(--secondary);
    border: 1px solid var(--primary-low);
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    min-width: 220px;
    padding: 8px 0;
  `;

  noteTypes.forEach(noteType => {
    const button = document.createElement('button');
    button.className = 'note-type-button';
    button.style.cssText = `
      width: 100%;
      padding: 10px 16px;
      border: none;
      background: transparent;
      color: var(--primary);
      text-align: left;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      transition: background-color 0.2s;
      font-size: 14px;
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

  // Position dropdown below the button
  const buttonElement = e.target.closest('button');
  if (buttonElement) {
    const rect = buttonElement.getBoundingClientRect();
    dropdown.style.left = rect.left + 'px';
    dropdown.style.top = (rect.bottom + 5) + 'px';
    
    document.body.appendChild(dropdown);
    
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
