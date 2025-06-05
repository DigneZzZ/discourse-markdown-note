# name: markdown-note
# about: A BBCode Markdown extension for notes with full tag support, editor buttons, dark theme support and admin settings panel
# version: 0.5.0
# authors: DigneZzZ
# url: https://github.com/DigneZzZ/discourse-markdown-note

register_asset "stylesheets/notifications.scss"
register_asset "stylesheets/admin.scss"

# Define settings for the plugin
enabled_site_setting :markdown_note_enabled

after_initialize do
  # Load admin controller
  require_relative "app/controllers/admin/markdown_note_controller"
  
  # Register admin routes for note customization
  Discourse::Application.routes.append do
    get '/admin/plugins/markdown-note' => 'admin/plugins#index', constraints: AdminConstraint.new
    get '/admin/plugins/markdown-note/settings' => 'admin/markdown_note#show', constraints: AdminConstraint.new
    post '/admin/plugins/markdown-note/settings' => 'admin/markdown_note#update', constraints: AdminConstraint.new
  end
end

