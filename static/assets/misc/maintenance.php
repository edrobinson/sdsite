<?php
/*
  Editor for the config table
  
  The client sends an Ajax post request
*/
  session_start();
  
//  require "assets/includes/config.php";
//  $config = new Config();
    require 'configServer.php';
    $config = new configServer();
  
  $db = new SQLite3($config->sqliteDbPath);
  
  $id      = $_POST['id'];
  $op      = $_POST['option'];
  $page    = $_POST['value'];
  
  //global $id,$page,$tag,$tagval; 
  
  //Validate the inputs
  if ($op == 'insert' or $op == 'update')
  {
    $s = '';
    if ($option == '')    $s .= "Option is required.\n";
    if ($value  == '')    $s .= "value is required.\n";
    if($s !== '')
    {
      echo($s);
      exit();
    }
  }
   
// ************************************** Begin Client Request Service Functions ******************
   //Handle a request from the editor
  switch ($op){
      case 'read':
          read();
          break;
      case 'update':
          update();
          break;
      case 'insert':
          insert();
          break;
      case 'delete':
          delete();
          break;
      case 'readfirst':
          readFirst();
          break;
      case 'readprev':
          readPrev();
          break;
      case 'readnext':
          readNext();
          break;
      case 'readlast':
          readLast();
          break;
      case 'lookup':
          lookup();
          break;
      case 'lookupread':
          lookupRead();
          break;
          
      default:
          response("Invalid operation code received: $op");
          exit;
          
  }
    

    //********************* Begin CRUD Service Functions*******************************  

    function read()
    {
        global $id,$option,$value,$db; 
        //read by title
        $row = utilityread();

        if($row['id'] == '')
        {
            response('No record found...');
            exit();
        }else{
            returnValues($row);
        }
    }
    
    //Read for the lookup service...
    function lookupRead()
    {
        global $id,$option,$value,$db; 
        $qry  = "select * from config where id = ". $id;
        return doCrudQuery($qry);
    }
    
    function update()
    {
        global $id,$option,$value,$db; 
        
        //Do we have the record id?
        if ($id == ''){
            response('No Id available. read a text record and try again...');
        }
        
        
        $qry  = "update config ";
        $qry .= "set option = '$option',";
        $qry .= "value = '$value";
        $qry .= "where id = $id";
       // var_dump($qry); die;
        $res = $db->exec($qry);
        //$row = $res->fetchArray(SQLITE3_ASSOC);
        if (!$row)
        {
            response('The Update Failed. Call Dad.');
        }else{
            response('The record was updated.');
        }
        exit();
    }
    
   function delete()
   {
        global $id,$page,$tag,$tagval,$db; 
        $lastid = $id;
        
        //Do we have a record id?
        if ($lastid == ''){
            response('No Id available. read a text record and try again...');
        }
        
        $qry = "delete from config where id = $lastid";
        $res = $db->exec($qry);
        if (!$res)
        {
            response('Delete failed. Call Dad.');
        }else{
            response('Record deleted.');

        }
   }
    
    function insert()
    {
        global $id,$page,$tag,$tagval,$db; 
        $qry = "insert into config (option, value)
                values('$option','$value')";
        $res = $db->exec($qry);
        if (!$res)
        {
            response('Insert operation failed.');
        }else{
            response('Record added.');
        }
        exit();
    }
   

    function readFirst(){
        $qry = "select * from config limit 1";
        doCrudQuery($qry);
    }
     
   
    function readLast(){
        $qry = "select * from config order by id desc limit 1";
        doCrudQuery($qry);
    
    }
    
    function readNext(){
        global $id;
        $qry  = "select * from config where id = (select min(id) from config  where id > $id)";
        doCrudQuery($qry);
    }
    
    function readPrev(){
        global $id;
        $qry  = "select * from config where id = (select max(id) from config where id <  $id)";
        doCrudQuery($qry);
    }
    
    
    function lookup(){
        $lookup = new Lookup('config', $db);
        $lookup = new Lookup('config', $db);
        $opts = $lookup->processLookupRequest();
        if ($opts === false)
        {
            response('Lookup found no text records...');
           
        }else{
            call('lookupHandler',$opts);
            exit();
        }
    }


    
  
 //****************************** Utility Functions *****************************  
   
    
    //Read
    function utilityread()
    {
        global $id,$option,$value,$db; 
        $qry = "select * from config where option = '$option'";
        $res = $db->query($qry);

        //Always returne a row but it may be empty...
        $row = $res->fetchArray(SQLITE3_ASSOC);
        return $row;
    } 

    //Execute the passed select query
    //Fill out the response assigns for each field
    function doCrudQuery($query)
    {
        global $id,$option,$value,$db; 
        //Execute the query
        $res = $db->query($query);
        $row = $res->fetchArray(SQLITE3_ASSOC);
        
        //Process the responses to the client
        if($row['id'] == '')
        {
            response('No record found...');
        }else{
            returnValues($row);
        }
        
    }
    
    //Return a message to the client
    function response($s)
    {
      echo('>'.$s);
      exit();
    }

    //Return the result to the client
    function returnValues($row)
    {
      echo(json_encode($row));
      exit();
    }
    
