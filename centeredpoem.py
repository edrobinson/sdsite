import docx2txt

# Even and odd numbers throw the centering off.
# Make the input value an even number.
def makeEven(num):
    return num
    if num % 2:
        return num+ 1
    return num    


def center_poem_with_blanks_in_html_div(input_file, output_file):
    """
    This takes a docx of a "warped" poem converts it to text and
    puts back the leadding spaces to render it as written.
    The result can be put in a pre tag to display it.
    
    Positioning the text can be done with a text editor.
    """
    try:
        # Convert DOCX to text using docx2txt
        text = docx2txt.process(input_file)
        with open('RawText.txt', 'w') as file:
            file.write(text)
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