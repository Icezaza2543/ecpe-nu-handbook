import json
import re

with open("src/data/studyPlan.ts", "r", encoding="utf-8") as f:
    content = f.read()

# We need to remove the json object for these courses
slots_to_remove = [
    "year1-sem1-gened-slot-2",
    "year1-sem2-gened-slot-2",
    "year2-sem1-gened-slot-2",
    "year2-sem2-gened-slot-2"
]

for slot in slots_to_remove:
    # regex to find the object containing this courseId and remove it
    # it looks like: { ... "courseId": "slot-name" ... },
    # or { ... "courseId": "slot-name" ... }
    content = re.sub(r'\{\s*"code":\s*"001XXX",\s*"courseId":\s*"' + slot + r'".*?\},?', '', content, flags=re.DOTALL)
    
# clean up trailing commas before closing bracket if any
content = re.sub(r',\s*\]', '\n          ]', content)

with open("src/data/studyPlan.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Removed extra GE courses.")
