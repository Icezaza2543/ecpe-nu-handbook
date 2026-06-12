import json
import re

with open("src/data/studyPlan.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Insert into Year 3 Sem 1
sem1_insert = """            {
              "code": "305391",
              "courseId": "305391-field-experience-4",
              "titleTh": "ประสบการณ์ภาคสนาม 4",
              "credits": "1(0-3-1)",
              "status": "บังคับ (ไม่นับหน่วยกิต)",
              "counted": false,
              "isSlot": false,
              "officialPrerequisiteText": "-"
            },
            {
              "code": "XXXXXX",
              "courseId": "year3-sem1-free-elective-slot-1",
              "titleTh": "เลือกเสรี(วิชาภาค)",
              "credits": "3(x-x-x)",
              "status": "เลือกเสรี",
              "counted": true,
              "isSlot": true,
              "officialPrerequisiteText": "-"
            }"""
content = content.replace('            {\n              "code": "305391",\n              "courseId": "305391-field-experience-4",\n              "titleTh": "ประสบการณ์ภาคสนาม 4",\n              "credits": "1(0-3-1)",\n              "status": "บังคับ (ไม่นับหน่วยกิต)",\n              "counted": false,\n              "isSlot": false,\n              "officialPrerequisiteText": "-"\n            }', sem1_insert)

# Insert into Year 3 Sem 2
sem2_insert = """            {
              "code": "305392",
              "courseId": "305392-field-experience-5",
              "titleTh": "ประสบการณ์ภาคสนาม 5",
              "credits": "1(0-3-1)",
              "status": "บังคับ (ไม่นับหน่วยกิต)",
              "counted": false,
              "isSlot": false,
              "officialPrerequisiteText": "-"
            },
            {
              "code": "XXXXXX",
              "courseId": "year3-sem2-free-elective-slot-1",
              "titleTh": "เลือกเสรี(วิชาภาค)",
              "credits": "3(x-x-x)",
              "status": "เลือกเสรี",
              "counted": true,
              "isSlot": true,
              "officialPrerequisiteText": "-"
            }"""
content = content.replace('            {\n              "code": "305392",\n              "courseId": "305392-field-experience-5",\n              "titleTh": "ประสบการณ์ภาคสนาม 5",\n              "credits": "1(0-3-1)",\n              "status": "บังคับ (ไม่นับหน่วยกิต)",\n              "counted": false,\n              "isSlot": false,\n              "officialPrerequisiteText": "-"\n            }', sem2_insert)

with open("src/data/studyPlan.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Restored.")
