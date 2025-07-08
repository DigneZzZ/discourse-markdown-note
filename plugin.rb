# name: discourse-markdown-note
# about: A BBCode Markdown extension for notes with full tag support, dark theme support and customizable styling
# version: 0.8.7
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
      negative: I18n.t('js.note.negative_title'),
      positive: I18n.t('js.note.positive_title'),
      caution: I18n.t('js.note.caution_title'),
      tip: I18n.t('js.note.tip_title'),
      todo: I18n.t('js.note.todo_title'),
      bug: I18n.t('js.note.bug_title'),
      feature: I18n.t('js.note.feature_title'),
      security: I18n.t('js.note.security_title')
    }.to_json
  end
end

