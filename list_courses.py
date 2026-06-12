import json

with open("src/data/studyPlan.ts", "r", encoding="utf-8") as f:
    text = f.read()

# basic json parsing
import re

years = re.split(r'"year":\s*\d+', text)
for i, year_block in enumerate(years):
    if i == 0: continue
    if i > 2: break
    semesters = re.split(r'"id":\s*"(year\d+-sem\d+)"', year_block)
    for j in range(1, len(semesters), 2):
        sem_id = semesters[j]
        sem_content = semesters[j+1]
        print(f"\n--- {sem_id} ---")
        courses = re.findall(r'"code":\s*"(.*?)".*?"titleTh":\s*"(.*?)".*?"credits":\s*"(.*?)"', sem_content, re.DOTALL)
        for c in courses:
            print(f"{c[0]} : {c[1]} : {c[2]}")
