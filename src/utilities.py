''' Utilities and Handlers '''
from flask import session, url_for
from app import get_db
from flask import current_app
import pymysql.cursors  
import datetime
import requests
import json
import sqlite3

#This is a generic select given a table, optional column list, where and orderby phrases.
def sqlSelect(table, columns= '*', where='', orderby='' ):
        sql = f'select {columns} from {table}'
        if where != '':
            sql = f'{sql} where {where}'
        if orderby != '':
            sql = f'{sql} order by {orderby}'
        db = get_db()
        cursor = db.cursor()
        cursor.execute(sql)
        rows = cursor.fetchall()
        if rows:
            return rows
        else:
            return False
 
def getFAQs():
    return sqlSelect('faqs', '*', '','question')
 
#Geet book gets the book db record, the sumary and the excerpt
def getBook(id):
    data =  sqlSelect('books', '*', 'id='+id)
    dta = dict(data[0])
    
    dta['summary'] = getBookText(dta['title'], 'summary') 
    dta['extract'] = getBookText(dta['title'], 'excerpt') 
    return dta
    
def getBooks(): 
   return sqlSelect('books', '*', '','title')

def getLpsBooks(): 
   return sqlSelect('lpsbooks', '*', '','title')

def getBlogs():
    return sqlSelect('blog', '*')

def getBlog(id):
    return sqlSelect('blog', '*', 'id='+id)

def getOrders():
    return sqlSelect('orders', '*', '','ordernum')

def getOrder(id):
    return sqlSelect('orders', '*', 'id='+id)

def getPoems():
    return sqlSelect('poems', 'id, title, poem', '','poem')
    
def getPoem(id):
    return sqlSelect('poems', '*', 'id='+id)

    
def getProse():
        return sqlSelect('prose', 'id, title, description', '','title')

def getProseArticle(id):
    db = get_db()
    cursor = db.cursor()
    sql = f"SELECT * FROM prose where id = {id}"
    cursor.execute(sql)
    results = cursor.fetchone()
    return results
    
    
def getContacts():
    return sqlSelect('contacts', 'id, name', '','name')
 
def validateContact(data):
    for k, v in data.items():
        if v == '': 
            return False
    return True

#This def saves a contact to the db and emails the site manager about it
def storeContact(data):
    print(data)
    if not validateContact(data):
        return "All form fields are required. Please try again."
    try:
        db = get_db()
        columns = ", ".join(data.keys())
        placeholders = ", ".join(["?"] * len(data))
        query = f"INSERT INTO contacts ({columns}) VALUES ({placeholders})"
        values = tuple(data.values())
        print(query)
        db = get_db()
        cursor = db.cursor()
        cursor.execute(query, values)
        last_Id = cursor.lastrowid
        db.commit()
    except Exception as e:   
        return f'Insert Error: {e}'
    finally:
        db.close()        
 
    #Email the site owner
    recipName = current_app.config['SITE_OWNER']
    subject = 'New Contact Received'
    recipient = 'edrobinsonjr@gmail.com'
    
    msg = f"""
{recipName},

A new contact has been received on the website.
 
Here are the details:
 
Contact Name: {data['name']}
Email: {data['email']}
Subject: {data['subject']}
Website: {data['website']}
Message:
{data['message']}
      
    Regards from your site . . .
    """
    if sendEmail(subject, msg, recipient):
        return "Thank you for contacting me. I will respond soon."        
    return 'There was a processing error. Please try again soon. Thanlks . . .'
 

 
    
    
# ------------------------------ Begin a set of DB CRUD Functions ---------------------------------------- 

#Create/Insert a row
# params = table, data
#Data is an object of key value pairs for the columns to insert
#table, data
def create(params):
    params = json.loads(params)
    try:
        table = params['table']
        data = params['data']
    except Exception as e:
        return f'Error: Create operation requires table name and data from the form. {e}'
    
    columns = ", ".join(data.keys())
    placeholders = ", ".join(["?"] * len(data))
    query = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"
    values = tuple(data.values())
    print(f'In Create: {query} Values: {values}')
    db = get_db()
    cursor = db.cursor()
    cursor.execute(query, values)
    last_Id = cursor.lastrowid
    db.commit()
    db.close()
    return last_Id
    
#Read one or all records
#columns is a list of column names. Use "*" for all
#conditions is a string where phrase
#If conditions is empty, all rows will be returned
#else only those meeting the conditions. i.e. id = 10 returns one row
# table, columns='*', conditions=None
def read(params):
    params = json.loads(params)
    
    try:
        table = params['table']
        columns = params['columns']
        conditions = params['conditions']
    except Exception as e:
        return f'Error: Read operation requires table name, column names and conditions. {e}'
    try:    
        query = f'Select {columns} from {table} '

        if conditions != None:
            query = f'{query} where {conditions}'
        print(f'In Crud Read: {query}')    
        db = get_db()
        cursor = db.cursor()
        cursor.execute(query)
        rows = cursor.fetchall()
        numrows = len(rows)
        print(f'Numrows = {numrows}')
        if numrows < 1:
            return 'Error: Record not found.'
        elif numrows == 1:
            return rows[0]
        else:
            return rows
    except sqlite3.Error as e:
        return f'Database error: {e}'
    except Exception as e: # Catch any other unexpected errors during query execution or processing
        return f'An unexpected error occurred: {e}'
        
#Update a record or records in a table
#data is a dictionary of columns and their new values
#conditions is a string where phrase
#table, data, conditions=None
def update(params ):
    params = json.loads(params)

    try:
        table = params['table']
        data  = params['data']
        conditions = params['conditions']
    except Exception as e:
        return f'Error: Update operation requires table name, form data and conditions. {e}'

    try:
        #Create the SET clause and the values 
        set_clause_parts = []
        set_values = []
        
        for key, value in data.items():
            set_clause_parts.append(f"{key} = ?")
            set_values.append(value)
            
        #Create the element = ?, ... string
        set_clause = ", ".join(set_clause_parts)
        #Convert the values to a (value, value,...)
        set_values = tuple(set_values)
        
        #create the base query
        query = f'UPDATE {table} SET {set_clause}'
        
        #Add the where clause
        if conditions != None:
            query = f'{query} where {conditions}'

        #Run it
        db = get_db()
        cursor = db.cursor()
        cursor.execute(query, set_values)
        numrows = cursor.rowcount
        db.commit()
        db.close()
        
        if numrows: 
            return 'Record Updated.'
        else:
            return 'Update operation failed.'
    except sqlite3.Error as e:
        return f'Database error: {e}'
    except Exception as e:
        return f'An unexpected error occurred: {e}'
    
#Deletes one or more rows from a table
# table, conditions=None
def delete(params):
    params = json.loads(params)
    print(f'In Delete: {params}')

    try:
        table = params['table']
        conditions = params['conditions']
    except Exception as e:
        return f'Error: Delete operation requires table name, conditions. {e}'
 
    query = f'delete from {table} where {conditions}'
 
    db = get_db()
    cursor = db.cursor()
    cursor.execute(query)
    numrows = cursor.rowcount
    db.commit()
    db.close()
    if numrows: 
        return 'Record Deleted . . .'
    return 'Delete request failed.'
    
#Place an order for a book in the orders table 
#The data contains all of the table user fields
#This fills out the remaining fields and saves the record    
def placeBookOrder(data, bookId):
    #Get the book record
    bookRec = getBook(bookId)
    bookRec = bookRec[0] #Comes back as a list with 1 item . . .
    
    #Fill out the remaining fields
    data['bookid'] = bookId
    data['price'] = bookRec['price']
    data['status'] = "new"
    x = datetime.datetime.now()
    data['ordernum'] = x.strftime("%Y%m%d%H%M")  
    data['orderdate'] = x.strftime("%Y-%m-%d")
    
    #Save to the DB
    columns = ", ".join(data.keys())
    placeholders = ", ".join(["%s"] * len(data))
    query = f"INSERT INTO orders ({columns}) VALUES ({placeholders})"
    values = tuple(data.values())
    db = get_db()
    cursor = db.cursor()
    cursor.execute(query, values)
    last_Id = cursor.lastrowid
    db.commit()
    db.close()

    if not last_Id:
        return 'Failed to save your order. Please try again later.'
    
    #Email the site owner
    recipName = current_app.config['SITE_OWNER']
    print(f'Owner: {recipName}')

    subject = 'New Book Order Received'

    recipient = 'edrobinsonjr@gmail.com'
 
    msg = f'{recipName},\n'
    msg = f'{msg}  A new book order has been received.\n Here are the details:\n\n'
    msg = f'{msg} Ordered By: {data['name']}\n'
    msg = f'{msg} Email:{data['email']}\n'
    msg = f'{msg} Order Number:{data['ordernum']}\n\n'
    msg = f'{msg} Regards from your site . . .\n'
 
    if sendEmail(subject, msg, recipient):
        return 'Yor order has been received. I will ship it soon.'
    return 'There was a processing error. Please try again soon. Thanlks . . .'
            
#Interface to Flask-Mail
def sendEmail(subject, message, recipient):
    flask_app_url = "http://localhost:5000/send_email"
    headers = {'Content-Type': 'application/json'}
    payload = {
        'subject': subject,
        'msgbody': message,
        'recipient': recipient
    }
    try:
        response = requests.post(flask_app_url, headers=headers, json = payload)
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx or 5xx)
        return True
    except requests.exceptions.RequestException as e:
        print(f"From sendEmailError invoking Flask route: {e}")
        return False
    
#Rebuild the Books and Poems navbar ULs.
#This insures they are current after the addition of new records.
def navbarMaint():
     #build the books list
    tmpl = '<li><a class="dropdown-item" href="/showbook/[id]">[title]</a></li>\n'
    books = getBooks()
    booklist = '<ul class="dropdown-menu">\n' #Start <ul>
    for book in books: #add each book <li>
        tpl = tmpl
        idee = book['id']
        title = book['title']
        bid = str(idee)
        tpl = tpl.replace('[id]', bid)
        tpl = tpl.replace('[title]', title)
        booklist = booklist + tpl
    booklist = booklist + '</ul>\n' #End <ul>
    #Save it  . . .
    with open("./templates/booksul.html", "w") as file:
        file.write(booklist)
    
     #build the lpsbooks list
    tmpl = '<li><a class="dropdown-item" href="/showbook/[id]">[title]</a></li>\n'
    books = getLpsBooks()
    booklist = '<ul class="dropdown-menu">\n' #Start <ul>
    for book in books: #add each book <li>
        tpl = tmpl
        idee = book['id']
        title = book['title']
        bid = str(idee)
        tpl = tpl.replace('[id]', bid)
        tpl = tpl.replace('[title]', title)
        booklist = booklist + tpl
    booklist = booklist + '</ul>\n' #End <ul>
    #Save it  . . .
    with open("./templates/lpsbooksul.html", "w") as file:
        file.write(booklist)
    
    #Likewise with the poems table
    tmpl = '<li><a class="dropdown-item" href="/showpoem/[id]">[title]</a></li>\n'
    poems = getPoems()
    poemlist = '<ul class="dropdown-menu">\n' #Start <ul>
    for poem in poems: #add each poem <li>
        tpl = tmpl
        idee = poem['id']
        title = poem['title']
        tpl = tpl.replace('[id]', str(idee))    
        tpl = tpl.replace('[title]', title)
        poemlist = poemlist + tpl
    poemlist = poemlist + '</ul>\n' #End <ul>
    #Save it  . . .
    with open("./templates/poemsul.html", "w") as file:
        file.write(poemlist)
    return "Nav bar book and poem list updated."

def getBookText(title, typ):
    bookfolder = current_app.config['BOOKDOCS']
    path = f'{bookfolder}{title} {typ}.txt' #Append the doc type
    with open(path, "r") as file:
        try:
            txt = file.read()
            return txt
        except Exception as e:
            return f'Error reading {typ} file: {e}'

def getPoemText(title):
    poemfolder = current_app.config['POEMDOCS']
    path = f'{poemfolder}{title} {typ}.txt'
    with open(path, "r") as file:
        try:
            txt = file.read()
            return txt
        except Exception as e:
            return f'Error reading poem file: {e}'
        