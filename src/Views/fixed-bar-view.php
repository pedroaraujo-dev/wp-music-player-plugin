<?php

$fixed_bar_bg_color              = get_option('fixed_bar_bg_color', '#669bbc');
$fixed_bar_text_color            = get_option('fixed_bar_text_color', '#003049');
$fixed_bar_button_icon_color     = get_option('fixed_bar_button_icon_color', '#003049');
$fixed_bar_navigation_icon_color = get_option('fixed_bar_navigation_icon_color', '#003049');
$fixed_bar_button_color          = get_option('fixed_bar_button_color', '#0077b6');
$fixed_bar_close_icon_color      = get_option('fixed_bar_close_icon_color', '#003049');

?>

<div
  class="music-bar music-bar--hidden"
  style="background: <?php echo esc_attr($fixed_bar_bg_color); ?>; color: <?php echo esc_attr($fixed_bar_text_color); ?>;" 
>
  <div aria-label="Fechar" class="music-bar__close" style="color: <?php echo esc_attr($fixed_bar_close_icon_color); ?>;">
    <?php
        $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/times.svg';
        if (file_exists($icon_path)) {
            echo file_get_contents($icon_path);
        }
    ?>
  </div>

  <div class="music-bar__content">

    <div class="music-bar__controls">
      <div
        aria-label="Anterior"
        class="music-bar__button music-bar__button--prev"
        style="color: <?php echo esc_attr($fixed_bar_navigation_icon_color); ?>;"
      >
         <?php
            $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/skip-previous.svg';
            if (file_exists($icon_path)) {
                echo file_get_contents($icon_path);
            }
        ?>
      </div>

      <div
        aria-label="Play"
        class="music-bar__button music-bar__button--play"
        style="background: <?php echo esc_attr($fixed_bar_button_color); ?>; color: <?php echo esc_attr($fixed_bar_button_icon_color); ?>;"
      >
        <div style="display: flex; align-items: center; justify-content: center; margin-left: 2px;">
          <?php
              $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/play.svg';
              if (file_exists($icon_path)) {
                  echo file_get_contents($icon_path);
              }
          ?>
        </div>
      </div>

      <div
        aria-label="Pause"
        class="music-bar__button music-bar__button--pause"
        style="background: <?php echo esc_attr($fixed_bar_button_color); ?>; color: <?php echo esc_attr($fixed_bar_button_icon_color); ?>; display: none;"
      >
        <?php
            $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/pause.svg';
            if (file_exists($icon_path)) {
                echo file_get_contents($icon_path);
            }
        ?>
      </div>

      <div
        aria-label="Próximo"
        class="music-bar__button music-bar__button--next"
        style="color: <?php echo esc_attr($fixed_bar_navigation_icon_color); ?>;"
      >
        <?php
            $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/skip-next.svg';
            if (file_exists($icon_path)) {
                echo file_get_contents($icon_path);
            }
        ?>
      </div>
    </div>

    <div class="music-bar__info">
      <div class="music-bar__track"></div>
      <div class="music-bar__category"></div>
    </div>

    <div class="music-bar__separator"></div>

    <div class="music-bar__progress">
      <div class="music-bar__time music-bar__time--current">0:00</div>
      <div class="music-bar__timeline">
        <div
          class="music-bar__timeline-bg"
          style="background: <?php echo esc_attr($fixed_bar_text_color); ?>;"
        >
        </div>
        <div
          class="music-bar__timeline-fill"
          style="background: <?php echo esc_attr($fixed_bar_text_color); ?>; --width: 0%;"
        ></div>
      </div>
      <div class="music-bar__time music-bar__time--total">0:00</div>
    </div>

    <div class="music-bar__actions">
      <div class="music-bar__volume-wrapper">
        <div class="music-bar__volume">
          <div
            class="music-bar__volume-track"
            style="background: <?php echo esc_attr($fixed_bar_text_color); ?>; --width: 0%;"
          >
          </div>
          <div
            class="music-bar__volume-fill"
            style="background: <?php echo esc_attr($fixed_bar_text_color); ?>; --width: 100%;"
          ></div>
        </div>

        <div
          aria-label="Silenciar"
          class="music-bar__volume-btn music-bar__volume-btn--mute"
          style="color: <?php echo esc_attr($fixed_bar_text_color); ?>;"
        >
          <?php
              $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/volume.svg';
              if (file_exists($icon_path)) {
                  echo file_get_contents($icon_path);
              }
          ?>
        </div>

        <div
          aria-label="Desativar silêncio"
          class="music-bar__volume-btn music-bar__volume-btn--unmute"
          style="color: <?php echo esc_attr($fixed_bar_text_color); ?>; display: none;"
        >
          <?php
              $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/mute.svg';
              if (file_exists($icon_path)) {
                  echo file_get_contents($icon_path);
              }
          ?>
        </div>
      </div>

      <a class="music-bar__download" role="button">
        <span class="music-bar__download-label">
          Baixar Áudio
        </span>

        <span class="music-bar__icon--download">
            <?php
                $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/download.svg';
                if (file_exists($icon_path)) {
                    echo file_get_contents($icon_path);
                }
            ?>
        </span>

        <span class="music-bar__icon--loading" style="display: none;">
            <?php
                $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/loading.svg';
                if (file_exists($icon_path)) {
                    echo file_get_contents($icon_path);
                }
            ?>
        </span>
      </a>
    </div>
  </div>
</div>

<audio id="audio-player" style="display: none;"></audio>