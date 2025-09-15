'''
Add <p> tags to a text.
Assumption: A blank line is a paragraph break
'''

fileName = input("Name of File to Process: ")
print(f'Processing: {fileName}')

if fileName == '':
    exit('Terminated - No File given.')
    
newContent = open('paragraphed.txt', 'w')    
newContent.write('<p>\n')

with open(fileName, 'r') as file:
    for line in file:
        line = line.strip()
        if line == '':
            newContent.write('</p>\n<p>')
        newContent.write(line + '\n')
    newContent.write('</p>\n')

newContent.close()
    
exit('Done - see paragraphed.txt.')    

        


 
    