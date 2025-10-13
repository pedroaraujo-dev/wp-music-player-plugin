<?php if (!empty($soundBanks)) : ?>
<div class="audio-track-library">
    <div class="audio-track-library__tabs-wrapper">
        <div class="audio-track-library__tabs">
            <?php foreach ($soundBanks as $bank): ?>
                <button 
                    class="audio-track-library__tab-button" 
                    aria-expanded="false" 
                    data-site="<?php echo esc_attr($site); ?>"
                    data-id="<?= esc_attr($bank['id']); ?>"
                    data-title="<?= esc_attr($bank['name']); ?>"
                >
                    <?php if (!empty($bank['icon'])): ?>
                        <img 
                            src="<?= esc_url(plugins_url('../assets/icons/' . $bank['icon'], __FILE__)); ?>" 
                            alt="<?= esc_attr($bank['name']); ?>" 
                            width="20"
                            height="20"
                        >
                    <?php endif; ?>
                    <?= esc_html($bank['name']); ?>
                </button>
            <?php endforeach; ?>
        </div>
    </div>

    <div class="audio-track-library__content"></div>
</div>
<?php else: ?>
<p>Nenhum banco de som configurado.</p>
<?php endif; ?>