import re

with open("src/data/studyPlan.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Pattern to find a course object by its courseId, assuming standard JSON-like object formatting within the array
def remove_course_by_id(text, course_id):
    # This regex matches the object containing the courseId, up to the next object or end of array
    # It assumes the object looks like { ... "courseId": "...", ... }
    # Since studyPlan.ts is formatted nicely, we can use a regex that matches the opening brace { to the closing brace }
    pattern = r'\s*\{\s*"code":\s*"[^"]*",\s*"courseId":\s*"' + re.escape(course_id) + r'".*?\},?'
    
    # We use re.DOTALL so .*? matches across multiple lines
    new_text = re.sub(pattern, '', text, flags=re.DOTALL)
    return new_text

content = remove_course_by_id(content, "year3-sem1-free-elective-slot-9")
content = remove_course_by_id(content, "year3-sem2-free-elective-slot-8")

# Fix potential trailing commas in course arrays
content = re.sub(r',\s*\]', '\n          ]', content)

with open("src/data/studyPlan.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Removed extra courses.")
