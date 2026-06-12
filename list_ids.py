import json
with open("src/data/studyPlan.ts", "r", encoding="utf-8") as f:
    text = f.read()

import re
matches = re.findall(r'"courseId":\s*"(year[12]-sem[12]-.*?)"', text)
for m in matches:
    print(m)
