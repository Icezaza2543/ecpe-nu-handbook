import json
import re

with open("src/data/studyPlan.ts", "r", encoding="utf-8") as f:
    content = f.read()

# For year1-sem1
sem1_insert = r""",
            {
              "code": "001XXX",
              "courseId": "year1-sem1-gened-slot-2",
              "titleTh": "Thai",
              "credits": "3(2-2-5)",
              "status": "วิชาศึกษาทั่วไป",
              "counted": true,
              "isSlot": true,
              "officialPrerequisiteText": "-"
            }"""
content = re.sub(r'(\{\s*"code":\s*"001XXX",\s*"courseId":\s*"year1-sem1-gened-slot-1".*?\})', r'\1' + sem1_insert, content, flags=re.DOTALL)

# For year1-sem2
sem2_insert = r""",
            {
              "code": "001XXX",
              "courseId": "year1-sem2-gened-slot-2",
              "titleTh": "GE หมวดมนุษยศาสตร์",
              "credits": "3(2-2-5)",
              "status": "วิชาศึกษาทั่วไป",
              "counted": true,
              "isSlot": true,
              "officialPrerequisiteText": "-"
            }"""
content = re.sub(r'(\{\s*"code":\s*"001XXX",\s*"courseId":\s*"year1-sem2-gened-slot-1".*?\})', r'\1' + sem2_insert, content, flags=re.DOTALL)

# For year2-sem1
y2sem1_insert = r""",
            {
              "code": "00XXXX",
              "courseId": "year2-sem1-gened-slot-2",
              "titleTh": "GE หมวดสังคมศาสตร์",
              "credits": "3(2-2-5)",
              "status": "วิชาศึกษาทั่วไป",
              "counted": true,
              "isSlot": true,
              "officialPrerequisiteText": "-"
            }"""
content = re.sub(r'(\{\s*"code":\s*"001XXX",\s*"courseId":\s*"year2-sem1-gened-slot-1".*?\})', r'\1' + y2sem1_insert, content, flags=re.DOTALL)

# For year2-sem2
y2sem2_insert = r""",
            {
              "code": "001XXX",
              "courseId": "year2-sem2-gened-slot-2",
              "titleTh": "GE หมวดวิทยาศาสตร์และคณิตศาสตร์",
              "credits": "3(2-2-5)",
              "status": "วิชาศึกษาทั่วไป",
              "counted": true,
              "isSlot": true,
              "officialPrerequisiteText": "-"
            }"""
content = re.sub(r'(\{\s*"code":\s*"001XXX",\s*"courseId":\s*"year2-sem2-gened-slot-1".*?\})', r'\1' + y2sem2_insert, content, flags=re.DOTALL)

with open("src/data/studyPlan.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Restored.")
