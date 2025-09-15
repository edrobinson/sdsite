<?php
/*
  Test script to test Class RD_Text_Extraction
  from Guthub by Nick Routsong.
  
  I have a sample docx to see if I can't provide a simple
  tool for the admin of sharladawn.com to make changes
  to the site's pages.
  
  
*/

require('convertToText.php');

// 1. extract the text
$response = RD_Text_Extraction::convert_to_text('sample.docx');

//The file containe 5 sections seperated by a pair of pipes ||.
//The text is the type||title text||author name||content text||[image file name]
//Type = text, book or poem
//2. Extract the parts to an array
$parts = explode ('||', $response);

//3. Display the parts
$nl ="\r\n";
print('Type =  ' . trim($parts[0]).$nl);
print('-----------------'.$nl);
print('Title =  ' . trim($parts[1]).$nl);
print('-----------------'.$nl);
print('Author =  ' . trim($parts[2]).$nl);
print('-----------------'.$nl);
print('Content =  ' . trim($parts[3]).$nl);
print('-----------------'.$nl);
print('Image File =  ' . trim($parts[4].$nl));