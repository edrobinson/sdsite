<?php
/*
   Sharla's site Project Configuration class
   Add to as needed.
   
  Config for localhost/sharladawn
*/
class Config {
  //Site mode - prod or dev
  public $sitemode = 'dev';
  
  //Site status - up, down - maintenance mode toggle
  public $sitestatus = 'up';
  
  //Maintenance page url 
  public $maintenancepage = 'maintenance.html';
  
	//App. default page
	public $defaultPage = 'index';
    
  //App default site. [aws or lps]
  public $defaultSite = 'aws'; 
  
  //Path to the Sqlite DB
  public $sqliteDbPath = 'db/sddb.sqlite3';
  
  //Root folder of the blog package
  public $blogFolder = 'wordpress';
  
  //Root page name
  public $rootpagename = 'American Woman Suspended';

  //Text for the footer copyright notices
  public $footerText = ' by Sharla Dawn Robinson Ng. All rights reserved by my Dad.';
  
  //Email address for the contact us emails
  //Change when hosted...
  public $siteEmail = 'edrobinsonjr@gmail.com';
  
  //Login User ID
  public $userId = 'admin';
  
  //Login Password
  public $adminPassword = 'awsadmin';
  
  //Site name
  public $sitename = 'Sharla Dawn';
  
  //Site URL - Change when hosted
  //Change when hosted
  public $siteurl = 'http://www.localhost/sharladawn';
  
  //Contact URL
  //Change when hosted
  public $contacturl = 'http://www.localhost/sharla/contact';
  
  //Path to the texts html pages
  public $pagepath  = 'html-pages/pagetexthtml/';
  
  //Path to generated html pages
  public $staticpath = 'sitepages/';

  /*
      Page Styling Defaults
  */
  public $backgroundcolor  = '#F5F5DC';
  public $textcolor        = 'black';
  public $fontfamily       = 'Tahoma, Arial, sans-serif';
  public $fontsize         = '18px';
  public $fontweight       = '590';
                         
}                          
?>