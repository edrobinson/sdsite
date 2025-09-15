#### Database Editors  
The project provides an editor for each of the tables in the database.  

They all work the same way:  
 - The form generator in the formgen folder is used to generate Flask templates for the tables.
  - The JS to access the CRUD processor via the app. /crud route is part of the base template.
    - This JS contains a JSON with all of the parameters to the CRUD processor. The table specific JS copies this JSON and fills out the appropriate values which it sends the the CRUD js as follows:
    
        1. id                   record id for read, update and delete      
        2. opcode          requested crud op 
        3. table              target table name
        4. fields              fields for making a select 
        5. query              query you build for the  get select function
        6. where             sql where clause  
        7. orderby          sql order by clause             
        8. ascdesc          sql ascending / descending
        9. limit                sql limit clause  
            
     