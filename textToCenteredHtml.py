'''
This python CL tool handles a problem faced when trying to center text
in an html page.

The input is a word doc and we docx2txt it to a text.
Docx2txt and every other converter looses the leading spaces leaving the text flush left.

We locate the longest line in the text and everything is centered on it using the nbsp code.
'''
import docx2txt
from pathlib import Path
import os

fileName = ''
outFilePath = ''
lengthOut = 0

def processFile(text, outFilePath):
    maxLength = 0
    output = ''
    
    #Find the longest line
    for line in text:
        slen = len(line)
        if slen > maxLength:
            maxLength = slen
    print(f'Max Length = {maxLength}')
        
    #build the output
    for line in text:
        line = line.strip()
        lineLen = len(line)
        print(f'{line} {lineLen}')
        if line == 'zzz':
            output = output + ' <br>'
            continue
            
        fillSize = ((maxLength - lineLen)// 2)
        #Generate the filler string
        filler = ""
        for i in range(int(fillSize)):
            filler = filler + '&nbsp'
        newLine = filler + line
        output = output + newLine + '<br>'
    with open(outFilePath, 'w') as file:
        file.write(output)
    exit('Done')
 
def setUp():
    exts = ['.doc', '.docx']
    #Get the input file or exit
    fileName = input('Path to target Word doc: ')
    if fileName == '': exit('Terminated: No file name given.')
    file_path = Path(fileName)
    if not file_path.exists():
        print(f'{fileName} does not exist.')
        setUp()
    
    root, extension = os.path.splitext(file_path)
    basename= os.path.splitext(os.path.basename(file_path))[0]
    if not extension in exts:
        print('Must be a .doc or .docx file.')
        setUp()
    
    outFilePath = f'./templates/{basename}.html'
    print(outFilePath)
    
    text = docx2txt.process(file_path)
    lines = text.split('\n')
    cleaned_lines = [line for line in lines if line.strip() != '']
    #cleaned_text = '\n'.join(cleaned_lines)
    
    print(cleaned_lines)
    return cleaned_lines, outFilePath 
    
if  __name__ == '__main__':
    text, outFilePath = setUp()
    processFile(text,    outFilePath)
    
    
