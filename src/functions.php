<?php
// add_theme_support( 'post-formats', array( 'video' ) );

function wpk_login_style() {
	wp_enqueue_style('wpk-style', get_stylesheet_directory_uri() . '/css/login.css', array(), null, 'all');
}
add_action( 'login_enqueue_scripts', 'wpk_login_style', 10 );

function wpk_admin_style() {
  wp_enqueue_style('wpk-style', get_theme_file_uri('/css/admin.css'), array(), null, 'all');
}
add_action( 'admin_enqueue_scripts', 'wpk_admin_style', 10 );

function wpk_files() {
  wp_enqueue_style('wpk-style', get_stylesheet_directory_uri() . '/css/main.css', array(), null, 'all');
  wp_register_script('wpk-nav', get_template_directory_uri() . '/js/nav.js', array(), null, true);
  wp_enqueue_script('promises', get_template_directory_uri() . '/lib/promise.min.js', array(), null, true);
  wp_enqueue_script('fetch', get_template_directory_uri() . '/lib/fetch.js', array('promises'), null, true);

  $wpk_vars = array(
    'site_name' => get_bloginfo('name'),
    'site_url' => get_bloginfo('url'),
    'rest_url' => get_rest_url(),
    'is_post' => is_singular(),
    'is_home' => is_front_page(),
    'post_id' => get_the_ID(),
    'show_grid_related' => true,
    'infinite_scroll' => false
  );
  wp_localize_script( 'wpk-nav', 'wpk_vars', $wpk_vars );
  wp_enqueue_script( 'wpk-nav' );

  wp_dequeue_script('wordfenceAJAXjs');
  wp_dequeue_script('jquery.wfcolorbox');
  wp_dequeue_style('wordfence-colorbox-style');
}
add_action( 'wp_enqueue_scripts', 'wpk_files' );

function load_wpcf7() {
  if ( function_exists( 'wpcf7_enqueue_scripts' ) ) {
      wpcf7_enqueue_scripts();
  }
  if ( function_exists( 'wpcf7_enqueue_styles' ) ) {
      wpcf7_enqueue_styles();
  }
}
add_action('wpcf7_contact_form', 'load_wpcf7');
add_filter( 'wpcf7_load_js', '__return_false' );
add_filter( 'wpcf7_load_css', '__return_false' );
add_filter( 'cpsh_load_styles', '__return_false' );

function wpk_menu() {
  register_nav_menus(array(
    'primary' => __('Main Navigation'),
    'secondary' => __('Footer Navigation'),
    'follow' => __('Follow')
  ));
}
add_action( 'init', 'wpk_menu' );

function wpk_head() { ?>
  <link rel="manifest" href="/wp-json/app/manifest">
<?php }
add_action( 'wp_head', 'wpk_head' );

acf_add_options_page(array(
	'page_title' => 'Post By Date',
	'menu_slug' => 'postbydate',
	'capability' => 'edit_theme_options',
	'redirect' => true,
	'icon_url' => 'dashicons-admin-settings'
));


?>
