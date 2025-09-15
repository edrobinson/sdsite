<?php
/*
  One shot to load the config table from the config class
*/
  
  require "assets/includes/config.php";
  $config = new Config();
  $db = new SQLite3('./db/sddb.sqlite3');
  $class_vars = get_class_vars(get_class($config));
  $i = 0;
  foreach ($class_vars as $name => $value) {
      $qry = "insert into config (option,value) values('$name', '$value')";
      $db->exec($qry);
      $i++;
  }
  echo('Wrote '.$i. 'records.)');

