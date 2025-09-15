#### Site Crud Service  

The site provides database CRUD for any page that needs it. 

Crud.py is imported by app.py and app.py contains a crud route that sends requests to it.  

The template, crudform.html, contains the start of a form with a set of hidden inputs for use by the page's JS.  
It should be included in any template wanting to use the CRUD operations.
  
Static/crud.js is included in the base template and contains 2 variables that the page's js fills out:  
 1. theTable takes the name of the table to use.
 2. theOperation takes the name of the of the CRUD operation to be invoked. Initially insert, read, readall, update and delete are provided.
 
 This was created for use by admin. editors but can be ued by any page that needs DB access.


 
