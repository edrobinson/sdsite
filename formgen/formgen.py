"""
This is a command line html form generator.
The script gets a list of the tables in the database then
does the following on each table:

1. Run a describe query on the table and get all of the field rows.
2. Initialize a new form.
3. Iterate over each row and generate an HTML form control for each
   one  based in it's type and add it to a variable forming the form body.
4. Complete the form by adding <form>/</form> tags.
5. Write the form to an html file using tablt_name.html.

If user enters "all" to the table name, the script generates a form for each table.

The setType() function tages the field's type to determine template to use for the field.

The script defines a set of field "templates" with tags in []'s like [name], [type] and [label].
The templates are copied and the tags are substituted with vaues.
"""

import os
import sys
import pymysql.cursors
import element_templates as templates
from db_connection import connectToDb

def createFlaskTemplate(form, table):
    with open('editortemplate.html', 'r') as f:
        tpl = f.read()

    tpl = tpl.replace("[title]", f'{table.capitalize()} Editor')
    tpl = tpl.replace('[form]', form)
    tpl = tpl.replace('[js]', f'{table}.js')
    
    tplpath = f'flasktemplates/{table}editor.html'
    with open(tplpath, 'w') as f:
        f.write(tpl)

def saveTheForm(form, table):
    form += "\n</form>"
    fname = f"forms/{table}form.html"
    with open(fname, "w") as f:
        f.write(form)


def buildFormElement(fieldname, ftype, key):
    if fieldname == "id": return ''
    if ftype == "textarea":
        tpl = templates.textareatpl
    else:
        tpl = templates.fieldtpl

    tpl = tpl.replace("[field]", fieldname)
    tpl = tpl.replace("[label]", fieldname.capitalize())
    tpl = tpl.replace("[type]", ftype)

    return tpl


"""
Sample column:

{'Field': 'id',
'Type': 'int',
'Null': 'NO', 
'Key': 'PRI', 
'Default': None, 
'Extra': 'auto_increment'} 
 """


# Iterate the columns and build the form
def processTable(table, columns):
    print(f"processing {table}")
    
    #Decide which form template to use
    form = templates.form

    for column in columns:
        field = column["Field"]
        fkey = column["Key"]
        ftype = column["Type"]
        ftype = fieldTypeToTag(ftype)
        element = buildFormElement(field, ftype, fkey)
        if element != '':
            form += element + "\n"

    saveTheForm(form, table)
    createFlaskTemplate(form, table)


def fieldTypeToTag(ftype):
    numtypes = "tinyint, smallint, mediumint, int, bigint, float, double,decimal"
    chartypes = "char, varchar"
    datetypes = "data, datetime, timestamp"
    texttypes = "text, mediumtext, longtext,blob, mediumblob, longblob, tinyblob"

    #Cleanup varchar
    if "(" in ftype:
        parts = ftype.split("(")
        ftype = parts[0]

    if ftype in numtypes:
        return "number"
    if ftype in chartypes:
        return "text"
    if ftype in datetypes:
        return "date"
    if ftype in texttypes:
        return "textarea"
    return "text"


def main():
    '''
    The main function does the following::
    1. Connect to the database
    2. Create a DB cursor
    3. Query show tables 
    4. Make a list of the tables
    5. For each table:
        1. get the table name
        2. run a describe query on the table and get it's columns
        3. Process the table producong a form and a Flask template for the table
    '''
    db = connectToDb()
    cursor = db.cursor()

    qry = "show tables"
    res = cursor.execute(qry)

    tables = [c for c in cursor]

    for x in tables:
        table = x["Tables_in_sddb"]
        qry = f"describe {table}"
        cursor.execute(qry)
        rows = cursor.fetchall()
        processTable(table, rows)


if __name__ == "__main__":
    main()
