<div class="music-bar">
  <button aria-label="Fechar" class="music-bar__close">
    <?php
        $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/times.svg';
        if (file_exists($icon_path)) {
            echo file_get_contents($icon_path);
        }
    ?>
  </button>

  <div class="music-bar__content">

    <div class="music-bar__controls">
      <button aria-label="Anterior" class="music-bar__button music-bar__button--prev">
         <?php
            $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/skip-previous.svg';
            if (file_exists($icon_path)) {
                echo file_get_contents($icon_path);
            }
        ?>
      </button>

      <button aria-label="Play/Pause" class="music-bar__button music-bar__button--toggle">
        <span class="music-bar__icon--play">
            <?php
                $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/play.svg';
                if (file_exists($icon_path)) {
                    echo file_get_contents($icon_path);
                }
            ?>
        </span>

        <span class="music-bar__icon--pause">
            <?php
                $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/pause.svg';
                if (file_exists($icon_path)) {
                    echo file_get_contents($icon_path);
                }
            ?>
        </span>
      </button>

      <button aria-label="Próximo" class="music-bar__button music-bar__button--next">
        <?php
            $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/skip-next.svg';
            if (file_exists($icon_path)) {
                echo file_get_contents($icon_path);
            }
        ?>
      </button>
    </div>

    <div class="music-bar__info">
      <div class="music-bar__track">Martins</div>
      <div class="music-bar__category">Vozes Masculinas</div>
    </div>

    <div class="music-bar__separator"></div>

    <div class="music-bar__progress">
      <div class="music-bar__time">0:00</div>
      <div class="music-bar__timeline">
        <div class="music-bar__timeline-bg">
          <div class="music-bar__timeline-fill" style="width: 0.448737%;">
            <div class="music-bar__timeline-handle"></div>
          </div>
        </div>
      </div>
      <div class="music-bar__time">1:29</div>
    </div>

    <div class="music-bar__actions">
      <div class="music-bar__volume">
        <div class="music-bar__volume-track">
          <div class="music-bar__volume-fill" style="width: 100%;">
            <div class="music-bar__volume-handle"></div>
          </div>
        </div>
        <button aria-label="Silenciar" class="music-bar__volume-btn">
          <?php
              $icon_path = plugin_dir_path(__FILE__) . '../../assets/icons/volume.svg';
              if (file_exists($icon_path)) {
                  echo file_get_contents($icon_path);
              }
          ?>
        </button>
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

        <span class="music-bar__icon--loading">
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

  <audio class="music-bar__audio" src="https://firebasestorage.googleapis.com/v0/b/dashboard-glc.appspot.com/o/mdv_bdv_masculinas%2FMartins.mp3_4B5lyUB48mKRkdOB3Who.mp3?alt=media&token=f6083115-4feb-422b-b1e3-b9eb3a8c7387"></audio>
</div>
