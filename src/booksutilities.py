''' Utilities and Handlers for the Books '''
from flask import  render_template
from flask import current_app
import datetime
import json
from markupsafe import escape
import html
import sqlite3
import src.utilities as utils

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

def showbook(id):
    cursor = connectToDb()
    sql = f"SELECT * FROM books where id = '{id}'"
    cursor.execute(sql)
    results = cursor.fetchone()
    return results


#Handle the CRUD requests from the editor
def processEdits(data):  
    match data.get('opcode'):
        case 'insert':
            return insertBook(data)
        case 'update':
            return updateBook(data)
        case 'delete':
            return deleteBook(data)
        case _:
            return f'Error - Invalid operation code: {data.get("opcode")}'

def nltobr(txt):
    stxt = "<br />".join(txt.split("\r\n"))
    #txt = txt.replace("\r\n"    , '<br/>')
    #txt = txt.replace('\n', '<br/>')
    #safetxt = escape(txt)
    return stxt
            
def insertBook(data):
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
   
    qry = f'insert into books {fields} values {values}'
    
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

def updateBook(data):
    db = pymysql.connect(host='localhost', user='root', password='', database='sddb', charset='utf8mb4',)
    cursor = db.cursor()
    sets = 'SET '
    for k, v in data.items():
        if k == 'id': continue
        if k == 'opcode': continue
        sets += k + ' = "' + v + '", '
    sets = sets.rstrip(', ')
    qry = 'UPDATE books '  + sets + ' where id = ' + str(data.get('id'))
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
 


def deleteBook(data):
    cur = connectToDb()
    idee = data.get('id')
    qry = 'delete from books where id =' + str(idee)
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
     
