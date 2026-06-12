import json
import re

with open("src/data/studyPlan.ts", "r", encoding="utf-8") as f:
    text = f.read()

# count 001XXX in year 1 and year 2 semesters
years = re.split(r'"year":\s*\d+', text)
for i, year_block in enumerate(years):
    if i == 0: continue
    year = i
    if year > 2: break
    
    semesters = re.split(r'"id":\s*"(year\d+-sem\d+)"', year_block)
    for j in range(1, len(semesters), 2):
        sem_id = semesters[j]
        sem_content = semesters[j+1]
        
        ge_count = sem_content.count('"code": "001XXX"')
        print(f"{sem_id} has {ge_count} GE courses.")
