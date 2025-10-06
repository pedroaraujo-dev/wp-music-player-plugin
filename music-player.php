<?php
/**
 * Plugin Name: Music Player
 * Description: Um player de música simples inserido via shortcode.
 * Version: 1.0.0
 * Author: Pedro Araujo
 */

if (!defined('ABSPATH')) {
    exit;
}

require_once plugin_dir_path(__FILE__) . 'vendor/autoload.php';

MusicPlayer\Init::register();
