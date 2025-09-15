### Formgen -simple Bootstrap form generator
This is a simple Python project that generates a Bootstrap form for each table in a MySQL database.  

#### Installation:
Just download the zip and extract it where you need it.  
    
#### Preliminaries:
   1. Edit db_connection.py
   2. Run formgen.py from the CL and examine the result in the forms folder. 
   
If you want to change the templates, save a copy of element_templates.py first. Then edit them as needed.  

The templates contain bracketed tags that the code replaces:
  1. [field] is replaced for the label for field, the id and name and the label value.
  2. [type] is the input type.
  3. [label] receives the capitalized [field] value in the label.  


