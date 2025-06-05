# frozen_string_literal: true

class Admin::MarkdownNoteController < Admin::AdminController
  def show
    @note_settings = {
      note_bg_color: SiteSetting.note_bg_color,
      note_border_color: SiteSetting.note_border_color,
      note_text_color: SiteSetting.note_text_color,
      info_bg_color: SiteSetting.info_bg_color,
      info_border_color: SiteSetting.info_border_color,
      info_text_color: SiteSetting.info_text_color,
      warn_bg_color: SiteSetting.warn_bg_color,
      warn_border_color: SiteSetting.warn_border_color,
      warn_text_color: SiteSetting.warn_text_color,
      negative_bg_color: SiteSetting.negative_bg_color,
      negative_border_color: SiteSetting.negative_border_color,
      negative_text_color: SiteSetting.negative_text_color,
      positive_bg_color: SiteSetting.positive_bg_color,
      positive_border_color: SiteSetting.positive_border_color,
      positive_text_color: SiteSetting.positive_text_color,
      caution_bg_color: SiteSetting.caution_bg_color,
      caution_border_color: SiteSetting.caution_border_color,
      caution_text_color: SiteSetting.caution_text_color
    }
    
    render json: @note_settings
  end

  def update
    params.require(:note_settings).permit!.each do |key, value|
      SiteSetting.set(key, value) if SiteSetting.respond_to?("#{key}=")
    end
    
    render json: { success: true, message: I18n.t('markdown_note.admin.settings_saved') }
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 422
  end
end
