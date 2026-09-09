<?php
$playlist_bg_color    = \MusicPlayer\Admin\Validation::colorOption('playlist_bg_color', '#f3f3f3');
$soundBankButtonBgColor         = \MusicPlayer\Admin\Validation::colorOption('sound_bank_button_background_color', 'rgba(0, 0, 0, 1)');
$soundBankButtonTextColor       = \MusicPlayer\Admin\Validation::colorOption('sound_bank_button_text_color', '#ffffff');
$soundBankButtonBgColorActive   = \MusicPlayer\Admin\Validation::colorOption('sound_bank_button_background_color_active', 'rgba(0, 0, 0, 0.8)');
$soundBankButtonTextColorActive = \MusicPlayer\Admin\Validation::colorOption('sound_bank_button_text_color_active', '#ffffff');
?>

<?php if (!empty($soundBanks)) : ?>
<div
class="audio-track-library" style="background: <?php echo esc_attr($playlist_bg_color); ?>;"
>
    <div class="audio-track-library__tabs-wrapper">
        <div class="audio-track-library__tabs">
            <?php foreach ($soundBanks as $bank): ?>
                <div
                    class="audio-track-library__tab-button" 
                    aria-expanded="false" 
                    data-site="<?php echo esc_attr($site); ?>"
                    data-id="<?= esc_attr($bank['id']); ?>"
                    data-title="<?= esc_attr($bank['name']); ?>"
                >
                    <?php if (!empty($bank['icon'])): ?>
                        <img 
                            src="<?= esc_url($bank['icon']); ?>" 
                            alt="<?= esc_attr($bank['name']); ?>" 
                            width="20"
                            height="20"
                        >
                    <?php endif; ?>
                    <?= esc_html($bank['name']); ?>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <div class="audio-track-library__content">
        <?php foreach ($soundBanks as $bank): ?>
            <div 
                class="audio-track-library__content-button" 
                aria-expanded="false" 
                data-site="<?php echo esc_attr($site); ?>"
                data-id="<?= esc_attr($bank['id']); ?>"
                data-title="<?= esc_attr($bank['name']); ?>"
            >
                <?php if (!empty($bank['icon'])): ?>
                    <img 
                        src="<?= esc_url($bank['icon']); ?>" 
                        alt="<?= esc_attr($bank['name']); ?>" 
                        width="20"
                        height="20"
                    >
                <?php endif; ?>
                <?= esc_html($bank['name']); ?>
                </div>
        <?php endforeach; ?>
    </div>
</div>
<?php endif; ?>