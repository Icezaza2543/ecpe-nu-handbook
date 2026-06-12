import json
import re

with open('src/data/courses.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# We can search for objects that have "type": "general-education"
blocks = re.findall(r'\{\s*"id":\s*"(.*?)",.*?"type":\s*"general-education"(.*?)\}', text, re.DOTALL)
for block in blocks:
    print(block[0]) # print id

