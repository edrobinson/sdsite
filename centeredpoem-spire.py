from spire.doc import *
from spire.doc.common import *

# Even and odd numbers throw the centering off.
# Make the input value an even number.
def makeEven(num):
    return num
    if num % 2:
        return num+ 1
    return num  

def convertFile(input_file):    
    # Convert DOCX to text using docx2txt
    document = Document()
    document.LoadFromFile(input_docx_file)
    document.SaveToFile("RawText.txt", FileFormat.Txt)
    document.Close()
    return True


def center_poem_with_blanks_in_html_div(input_file, output_file):
    try:
        if not convertFile(input_file): 
            exit('File Conversion Failed')
        with open('RawText.txt', 'r') as file:
           text = file.read()
        all_lines = text.split('\n')
        
        # 1. Find the longest non-empty line
        # Create a list of lines that are not just whitespace
        print(all_lines)
        if not all_lines:
            print("The document is empty or contains no text.")
            return
        
        longest_line_length = max(len(line) for line in all_lines)
        longest_line_length = makeEven(longest_line_length)
            
        # 2. Process all lines for centering
        centered_content = []
        for line in all_lines:
            line = line.strip()
            #Hack: Inserted zzz in originel emptys so we can replace it
            if not len(line):
                centered_content.append('\r\n')
                continue
                
            # Center the non-empty line as before
            length_difference = longest_line_length - makeEven(len(line))
            padding_count = length_difference // 2
            
            padding = " " * padding_count
            centered_content.append(f"{padding}{line}")
        final_content = "\n".join(centered_content)

        with open(output_file, "w", encoding="utf-8") as f:
            f.write(final_content)
            
        print(f"Poem successfully centered and saved to '{output_file}'")

    except FileNotFoundError:
        print(f"Error: The file '{input_file}' was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

# Example Usage
if __name__ == "__main__":
    input_docx_file = "C:/Users/edrob/Downloads/The Woman at the Steinway (final).docx"
    output_html_file = "CenteredPoemText"
    center_poem_with_blanks_in_html_div(input_docx_file, output_html_file)