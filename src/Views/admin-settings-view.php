<div class="wrap">
    <h1>Configurações do Music Player</h1>
    <form method="post" action="options.php">
        <?php
            settings_fields('music_player_settings');
            do_settings_sections('music-player-settings');
            submit_button();
        ?>
    </form>
</div>
