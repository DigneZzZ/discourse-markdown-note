# name: discourse-markdown-note
# about: A BBCode Markdown extension for notes with full tag support, dark theme support and customizable styling. Supports 8 note types: note, info, warn, error, success, important, security, question
# version: 1.0.2
# authors: DigneZzZ
# url: https://github.com/DigneZzZ/discourse-markdown-note

register_asset "stylesheets/notifications.scss"

# Define settings for the plugin
enabled_site_setting :discourse_markdown_note_enabled

after_initialize do
  # Register plugin note texts for translation
  register_html_builder('server:note-type-titles') do
    {
      note: I18n.t('js.note.note_title'),
      info: I18n.t('js.note.info_title'),
      warn: I18n.t('js.note.warn_title'),
      error: I18n.t('js.note.error_title'),
      success: I18n.t('js.note.success_title'),
      important: I18n.t('js.note.important_title'),
      security: I18n.t('js.note.security_title'),
      question: I18n.t('js.note.question_title')
    }.to_json
  end
end

