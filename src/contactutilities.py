''' Utilities and Handlers for the contacts '''
from flask import  render_template
from flask import current_app
import datetime
import json
import pymysql.cursors
from markupsafe import escape
import html



def dump(s):
    print(s, flush=True)

def connectToDb():
    global db
    # Connect to the SQLite database file specified in app.config
    db = sqlite3.connect(current_app.config['DATABASE'],
             detect_types=sqlite3.PARSE_DECLTYPES # Important for correctly parsing dates/times
    )
    # Set row_factory for dictionary-like access to columns
    db.row_factory = sqlite3.Row
    return db.cursor()

def getArticles():
    cursor = connectToDb()
    sql = "SELECT id, title, description FROM blog order by title"
    cursor.execute(sql)
    results = cursor.fetchall()
    return results

def showArticle(id):
    cursor = connectToDb()
    sql = f"SELECT content FROM blog where id = '{id}'"
    cursor.execute(sql)
    results = cursor.fetchone()
    results['content'] = results['content'].replace('\r', '<br/>')
    
    return results

def showPost(id):
    cursor = connectToDb()
    sql = f"SELECT * FROM blog where id = '{id}'"
    cursor.execute(sql)
    results = cursor.fetchone()
    #results['content'] = results['content'].replace('\r\n', '<br/>')
    return results
 
def validateArticle(data):
    for k, v in data.items():
        if v == '': 
            return False
    return True

def storeArticle(data):
    if not validateArticle(data):
        return "All form fields are required. Please try again."
    
    cursor = connectToDb()
    now = datetime.datetime.now()
    curdt = now.strftime("%Y-%m-%d %H:%M:%S")
    
    fields = f'(status, received, '
    values = f'("new", "{curdt}", '
    for k, v in data.items():
        fields = fields + k +', '
        values = values + f'"{v}", '
    fields = fields.rstrip(', ') + ')'
    values = values.rstrip(', ') + ')'
    qry = f'insert into contacts {fields} values {values}'

    try:
        with cursor() as c:
            c.execute(qry)
            db.commit()
    except Exception as e:   
        return f'Insert Error: {e}'
    finally:
        db.close()        
    
def postList():    
    cursor = connectToDb()
    sql = "SELECT * FROM blog order by title"
    cursor.execute(sql)
    results = cursor.fetchall()
    return results
 

#Handle the CRUD requests from the editor
def processEdits(data):  
    match data.get('opcode'):
        case 'insert':
            return insertPost(data)
        case 'update':
            return updatePost(data)
        case 'delete':
            return deletePost(data)
        case _:
            return f'Error - Invalid operation code: {data.get("opcode")}'

def nltobr(txt):
    stxt = "<br />".join(txt.split("\r\n"))
    return stxt
            
def insertPost(data):
    db = pymysql.connect(host='localhost', user='root', password='', database='sddb', charset='utf8mb4',)
    cursor = db.cursor()
    
    now = datetime.datetime.now()
    currentdt = now.strftime("%Y-%m-%d %H:%M:%S")
    fields = f'(created,'
    values = f'("{currentdt}", '
    
    #Create the insert query
    for k, v in data.items():
        if k == 'id': continue
        if k == 'opcode': continue
        if k == 'description': continue
        if k == 'content':
            v = html.escape(v)
        fields = fields + k +', '
        values = values + f"'{v}', "

    fields = fields.rstrip(', ') + ')'
    values = values.rstrip(', ') + ')'
   
    qry = f'insert into blog {fields} values {values}'
    try:
        cursor.execute(qry)
        db.commit()
        idee = cursor.lastrowid
        res = {
            "id" :  idee,
            "msg" : "Record added"
        }
        return json.dumps(res)
    except Exception as e:  
        return json.dumps(f'Insert Error: {e}')
    finally:
        db.close()

def updatePost(data):
    db = pymysql.connect(host='localhost', user='root', password='', database='sddb', charset='utf8mb4',)
    cursor = db.cursor()
    sets = 'SET '
    for k, v in data.items():
        if k == 'id': continue
        if k == 'opcode': continue
        sets += k + ' = "' + v + '", '
    sets = sets.rstrip(', ')
    qry = 'UPDATE blog '  + sets + ' where id = ' + str(data.get('id'))
    try:
        cursor.execute(qry)
        db.commit()
        rct = cursor.rowcount
        db.close()
        if rct > 0:
            return json.dumps('Record updated')
        else:
            return json.dumps('Could not update the record. Try again later.')
    except Exception as e:  
        db.close()        
        return json.dumps(f'Update Error: {e}')
 


def deletePost(data):
    cur = connectToDb()
    idee = data.get('id')
    qry = 'delete from blog where id =' + str(idee)
    try:
        cur.execute(qry)
        db.commit()
        rct = cur.rowcount
        db.close
        if rct > 0:
            return json.dumps('Record deleted')
        else:
            return json.dumps('Could not delete the record. Try again later.')
    except Exception as err:
        return json.dumps(f'Error: {err}')
     
