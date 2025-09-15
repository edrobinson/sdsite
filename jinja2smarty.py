#jinja2smarty.py
'''
This opena a joinja template, converts all jina tags to smarty syntax
and saves the result to a .tpl file.
'''
#jfile = input("Template to convert: ")
#if not jfile: 
#    exit()
    
jpath = f'./templates/pages/book.html'
print(jpath)
with open(jpath, 'r') as file:
        jtemplate = file.read()
        
        jtemplate = jtemplate.replace('{%', '{')
        jtemplate = jtemplate.replace('%}', '}')
        jtemplate = jtemplate.replace('{{', '{$')
        jtemplate = jtemplate.replace('}}', '}')
        jtemplate = jtemplate.replace('%}', '}')
        jtemplate = jtemplate.replace("['", '.')
        jtemplate = jtemplate.replace("']", '')
        jtemplate = jtemplate.replace('include', 'include file= ')
       
with open('j2smarty.tpl', 'w') as file:
       file.write(jtemplate)

exit()
        
        
        
        
        
        
        
        
      