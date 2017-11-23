<?php get_header(); ?>

<?php

  $wpkFoodDate = get_field('date_of_food', 'option');
  $wpkFoorCount = count($wpkFoodDate);
  $wpkFoodDateNow = date("j F");
  $wpkFoodActive = false;

  for($i=0;$i<$wpkFoorCount;$i++) {
    if($wpkFoodDateNow === $wpkFoodDate[$i]['food_date_yearly']) {
      $wpkFoodActive = true;
      $wpkFoodNumber = $i;
    }
  }

  if($wpkFoodActive === true) { ?>
    <section style="background:url(<?php echo $wpkFoodDate[$wpkFoodNumber]['food_image_background']; ?>);">
      <div class="container" style="display:flex;justify-content:center;min-height:400px;flex-direction:column;">
        <h3 style="color:white;text-shadow:0 0 10px black;"><?php echo $wpkFoodDate[$wpkFoodNumber]['food_title']; ?></h3>
        <div style="color:white;text-shadow:0 0 10px black;"><?php echo $wpkFoodDate[$wpkFoodNumber]['food_content'] ?></div>
      </div>
    </section>
  <?php }
?>

<?php get_footer();
