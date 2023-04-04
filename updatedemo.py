import re
import os

with open(os.path.join('chatchatchat','templates','index.html'), 'r') as index_file:
    index_contents = index_file.read()

# Define the regular expression pattern to match {% static 'path/to/file' %}
pattern = r"\{\%\s*static\s*'([^']+)'\s*\%\}"

# Use re.sub() to replace all occurrences of the pattern with the corresponding static file path
demo_contents = re.sub(pattern, r"static/\1", index_contents)
demo_contents = re.sub("{% load static %}", "", demo_contents)

with open(os.path.join('chatchatchat','demo.html'), 'w') as demo_file:
    demo_file.write(demo_contents)
