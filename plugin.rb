# name: discourse-markdown-note
# about: A BBCode Markdown extension for notes with full tag support, editor buttons, dark theme support and admin settings panel
# version: 0.7.3
# authors: DigneZzZ
# url: https://github.com/DigneZzZ/discourse-markdown-note

register_asset "stylesheets/notifications.scss"
register_asset "stylesheets/admin.scss"

# Define settings for the plugin
enabled_site_setting :discourse_markdown_note_enabled

add_admin_route 'discourse_markdown_note', 'markdown-note'

after_initialize do
  # Load admin controller
  require_relative "app/controllers/admin/markdown_note_controller"
  
  # Register admin routes for note customization
  Discourse::Application.routes.append do
    get '/admin/plugins/markdown-note' => 'admin/plugins#index', constraints: AdminConstraint.new
    get '/admin/plugins/markdown-note/settings' => 'admin/markdown_note#show', constraints: AdminConstraint.new
    post '/admin/plugins/markdown-note/settings' => 'admin/markdown_note#update', constraints: AdminConstraint.new
  end

  # Register plugin note texts for translation
  register_html_builder('server:note-type-titles') do
    {
      note: I18n.t('js.note.note_title'),
      info: I18n.t('js.note.info_title'),
      warn: I18n.t('js.note.warn_title'),
      negative: I18n.t('js.note.negative_title'),
      positive: I18n.t('js.note.positive_title'),
      caution: I18n.t('js.note.caution_title')
    }.to_json
  end
end

