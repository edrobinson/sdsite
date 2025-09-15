#### Admin. Maintenance Processes:       

The site depends on a MySQL database for storage.  
This document describes the tools provided for maintaining the database.  

##### Overview:  
Currently, the tables are blog, prose, books, contacts, orders and poems.  
 
Each table has a corresponding user page and an administrative editor page.   

The administration routes are page name + 'mgr'.   i.e.: blogmgr, prosemgr, etc 

All of the editors work alike:

The page load constructs a select tag with an option for each ecord ing the table.  
The user has these options: 
 1. Type a new record and click the create button.
 2. Select a record to deal with from the select than:
    - Edit the record and click the update button.
    - Click the delete button to remove it.
    
The prose and blog editors gave an additional feature:  
  They contain a file input that permits loading a text file containing the text for the blog or prose records.     

That's all there is to it.
