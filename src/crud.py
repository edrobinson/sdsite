'''
This file contains a class that wraps the MySQLCRUD class found in src/aicrud.py.
It is the target of the app crud route and prepares the data for the actual CRUD
methods and invokes them.

The driver is the "process" method.
Its input is a dict of the form fields including the control fields id, table and opcode
'''
from flask import jsonify
import pymysql.cursors 
import json
from src.aicrud import MySQLCRUD

class CRUD:
    #Fields that are excluded from insert and update methods 
    excludes = 'id, opcode, table'
 
    #Driver - call requested operation returning it's result
    #The data is a dictionary of page form fields plus the id, table and operation.
    def __init__(self):
        self.crudService = None

    def process(self, data):
        try:
            self.crudService = MySQLCRUD('localhost', 'root', '', 'sddb')
            operation = data.get('opcode')
            match operation:
                case 'insert':
                    return self.insert(data)
                case 'read':
                    return self.read(data)
                case 'readall':
                    return self.readAll(data)
                case 'update':
                    return self.update(data)
                case 'delete':
                    return self.delete(data)
                case 'select':
                    return self.select(data)
                case _:
                    msg = f'Unrecognized commans code: {opcode}'
                    return self.respond(False, msg)
        except Exception as e:
            msg = f'Crud process call failed: {e}'
            print(msg)
            return self.respond(False, msg)

    #Populate a response and return it to the caller
    def respond(self,stat = "", msg = "", id = "", values = ""  ):
        #Response JSON
        resp = {
           "ok" : 
               "", 
           "msg" : "",
            "id" : "",
            "values" : ""
         }
         
        resp["ok"] = stat
        resp["msg"] = msg
        resp["id"] = id
        resp["values"] = values
        return resp
 

    def insert(self, data):
        
        #fields and field values
        fields = '('
        values = '('
       
        #Iterate the data, creating the field and values list of the query
        recorddata = {}
        for k, v in data.items():
            if k in self.excludes: continue
            recorddata[k] = v
        try:
            idee = self.crudService.create(data['table'], recorddata) 
            if idee == False:
                return self.respond(False, "Failed to save the record.", idee)
            else:
                msg = f'Record added. Id = {idee}'
                return self.respond(True, msg, idee)
        except Exception as e: 
            msg = f"'Insert Error: {e}'"
            return self.respond(False, msg)
        
    #Read one record by id
    def read(self, data):
        id = data['id']
        condition = f'"id={data['id']}"'
        try:
            res = self.crudService.read_one(data['table'], condition)
            if res == False:
                return self.respond(False,'No record found.')
            else:
                return self.respond(True,'','',res)
        except Exception as e:
            msg = f"Read Error:  {e}"
            return self.respond(False,msg,'',res)
 
    #Read all records with optional query phrases
    def readAll(self, data):
        try:
            res = self.crudService.read_all(data['table'])
            if res == False:
                return self.respond(False,'No records found.')
            else:
                return self.respond(True,'','',res)
        except Exception as e:
            msg = f"Read Error:  {e}"
            return self.respond(False,msg,'',res)
        
    #Update a record - does all fields
    #All of the form fields are passed including
    #the hidden ones used for control.
    def update(self, data):
       print(f'Data passed to update: {data}')
       try:
            condition = f'id={data['id']}'
            table = data['table']
            
            #Remove the hidden elements do the update service doesn't
            #try to use them.
            fields = data
            del fields['id']
            del fields['opcode']
            del fields['table']
            
            res = self.crudService.update(table, fields, condition)
            
            if res == False:
                return self.respond(False,'Update failed.')
            else:
                return self.respond(True,'Record updated.')
       except Exception as e:
            msg = f"Update Error:  {e}"
            return self.respond(False,msg,'',res)
        
    #Delete  single record by id
    def delete(self, data):
       try:
            condition= f"id = {data['id']}"
            res = False
            res = self.crudService.delete(data['table'], condition)
            print('delete res: {res}')
            if res == False:
                return self.respond(False,'Delete failed.')
            else:
                return self.respond(True,'Record deleted.')
       except Exception as e:
            msg = f"Delete Error:  {e}"
            return self.respond(False,msg,'',res)
            
            
    #Run a user query
    def select(self, data):
        cur = self.db.cursor()
        cursor.execute(data['query'])
        db.commit()
        nrows = cursor.rowcount
        if nrows < 1:
            return self.respond(False,"Query failled.")
        else:
            results = json.dumps(cursor.fetchall())
            return self.respond(True,'','',results)
        
        

        
