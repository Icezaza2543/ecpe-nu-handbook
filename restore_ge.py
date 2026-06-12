import json

with open("src/data/studyPlan.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Insert into Year 1 Sem 1
sem1_insert = """            {
              "code": "001XXX",
              "courseId": "year1-sem1-gened-slot-1",
              "titleTh": "ENG",
              "credits": "3(2-2-5)",
              "status": "วิชาศึกษาทั่วไป",
              "counted": true,
              "isSlot": true,
              "officialPrerequisiteText": "-"
            },
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
content = content.replace('            {\n              "code": "001XXX",\n              "courseId": "year1-sem1-gened-slot-1",\n              "titleTh": "ENG",\n              "credits": "3(2-2-5)",\n              "status": "วิชาศึกษาทั่วไป",\n              "counted": true,\n              "isSlot": true,\n              "officialPrerequisiteText": "-"\n            }', sem1_insert)

# Insert into Year 1 Sem 2
sem2_insert = """            {
              "code": "001XXX",
              "courseId": "year1-sem2-gened-slot-1",
              "titleTh": "GE หมวดภาษา",
              "credits": "3(2-2-5)",
              "status": "วิชาศึกษาทั่วไป",
              "counted": true,
              "isSlot": true,
              "officialPrerequisiteText": "-"
            },
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
content = content.replace('            {\n              "code": "001XXX",\n              "courseId": "year1-sem2-gened-slot-1",\n              "titleTh": "GE หมวดภาษา",\n              "credits": "3(2-2-5)",\n              "status": "วิชาศึกษาทั่วไป",\n              "counted": true,\n              "isSlot": true,\n              "officialPrerequisiteText": "-"\n            }', sem2_insert)

# Insert into Year 2 Sem 1
y2sem1_insert = """            {
              "code": "001XXX",
              "courseId": "year2-sem1-gened-slot-1",
              "titleTh": "GE หมวดภาษา",
              "credits": "3(2-2-5)",
              "status": "วิชาศึกษาทั่วไป",
              "counted": true,
              "isSlot": true,
              "officialPrerequisiteText": "-"
            },
            {
              "code": "001XXX",
              "courseId": "year2-sem1-gened-slot-2",
              "titleTh": "GE หมวดสังคมศาสตร์",
              "credits": "3(2-2-5)",
              "status": "วิชาศึกษาทั่วไป",
              "counted": true,
              "isSlot": true,
              "officialPrerequisiteText": "-"
            }"""
content = content.replace('            {\n              "code": "001XXX",\n              "courseId": "year2-sem1-gened-slot-1",\n              "titleTh": "GE หมวดภาษา",\n              "credits": "3(2-2-5)",\n              "status": "วิชาศึกษาทั่วไป",\n              "counted": true,\n              "isSlot": true,\n              "officialPrerequisiteText": "-"\n            }', y2sem1_insert)

# Insert into Year 2 Sem 2
y2sem2_insert = """            {
              "code": "001XXX",
              "courseId": "year2-sem2-gened-slot-1",
              "titleTh": "GE หมวดมนุษยศาสตร์",
              "credits": "3(2-2-5)",
              "status": "วิชาศึกษาทั่วไป",
              "counted": true,
              "isSlot": true,
              "officialPrerequisiteText": "-"
            },
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
content = content.replace('            {\n              "code": "001XXX",\n              "courseId": "year2-sem2-gened-slot-1",\n              "titleTh": "GE หมวดมนุษยศาสตร์",\n              "credits": "3(2-2-5)",\n              "status": "วิชาศึกษาทั่วไป",\n              "counted": true,\n              "isSlot": true,\n              "officialPrerequisiteText": "-"\n            }', y2sem2_insert)

with open("src/data/studyPlan.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Restored.")
