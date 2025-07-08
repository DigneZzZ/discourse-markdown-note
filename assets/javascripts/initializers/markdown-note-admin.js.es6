// Admin interface extensions for discourse-markdown-note plugin
// This initializer is only for admin-specific functionality

import { withPluginApi } from "discourse/lib/plugin-api";

function initializeMarkdownNoteAdmin(api) {
  // Only initialize on admin routes
  const currentPath = window.location.pathname;
  const isAdminRoute = currentPath.startsWith('/admin');
  
  if (!isAdminRoute) {
    // Not in admin, skip initialization
    return;
  }
  
  console.log('[Markdown Notes Admin] Admin interface initialized');
  
  // Here we can add admin-specific functionality in the future
  // For now, this file just prevents the "must export an initializer" error
}

export default {
  name: "markdown-note-admin",
  initialize(container) {
    withPluginApi("0.8.31", initializeMarkdownNoteAdmin);
  }
};