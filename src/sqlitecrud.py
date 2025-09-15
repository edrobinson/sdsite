import pymysql.cursors 
import json
'''
This script provides CRUD for an sqlite db
'''
class CRUD:
    excludes = "id, opcode, table, fields, query, where, orderbyascdesc, limit" 
    def __init__(self,db):    
            self.db = db                       #Database instance
            
    #Driver - call requested operation returning it's result
    def process(self,data):
        op = data['opcode']
        match op:
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
            case _:    
                return jsonify('Bad Opcode')     #Oops!   

    def insert(self,data):
        fields = '('
        values = '('
        print(f'Data: {data}')
       
        #Iterate the data, creating the field and values list of the query
        for k, v in data.items():
            if k in self.excludes: continue 
            fields = fields + k +', '
            values = values + f"'{v}', "

        #Remove the traling comma and close the lists
        fields = fields.rstrip(', ') + ')'
        values = values.rstrip(', ') + ')'
        
        #Compose the query
        qry = f'insert into {data['table']} {fields} values {values}'
        print(f'Query: {qry}')
        try:
            cursor = self.db.cursor()
            cursor.execute(qry)
            self.db.commit()
            idee = cursor.lastrowid
            res = {
                "id" :  idee,
                "msg" : "Record added."
            }
            return json.dumps(res)
        except Exception as e: 
            res = {
                "id" :  '-1',
                "msg" : f"'Insert Error: {e}'"
            }
            return json.dumps(res)
        finally:
            self.db.close()
        
    #Read one record by id
    def read(self,data):
        cursor = self.db.cursor()
        sql = f"SELECT * FROM {data['table']} where id = {data['id']}"
        cursor.execute(sql)
        results = cursor.fetchone()
        
        return json.dumps(results)

    #Read all records
    def readAll(self,data):
        cursor = self.db.getcursor()
        qry = f"SELECT * FROM {data['table']}"
        
        if data['where'] != '':
            qry = f"{qry} {data['where']}"

        if data['orderby'] != '':
            qry = f"{qry} order by {data['orderby']}"
            if data['ascdesc'] != '':
                qry = f"{qry} {data['ascdesc']}"
        
        if data['limit'] != '':
            qry = f"{qry} limit {data['limit']}"
        print(qry, flush=True)  

        cursor.execute(qry)
        results = cursor.fetchall()
        return results
        
    #Update a record - does all fields
    def update(self,data):
        sets = 'SET '
        for k, v in data.items():
            if k in self.excludes: continue 
            sets += k + ' = "' + v + '", '

        sets = sets.rstrip(', ')
        qry = f"UPDATE {data.table} {sets} + ' where id = (data.get('id'))"
        try:
            cursor = self.db.cursor()
            cursor.execute(qry)
            db.commit()
            rct = cur.rowcount
            db.close()
            if rct > 0:
                return json.dumps('Record updated')
            else:
                return json.dumps('Could not update the record. Try again later.')
        except Exception as e:  
            db.close()        
            return json.dumps(f'Update Error: {e}')
       
    #Delete  single record by id
    def delete(self,data):
        cur = self.db.cursor()
        qry = f"delete from {data['table']} where id = {data['id']}"
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
     
