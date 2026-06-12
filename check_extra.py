import json
import re

exact_order = {
    'year1-sem1': ['252182', '261101', '261111', '001281', '305121', '305131', '305141', '305101', 'year1-sem1-gened-slot-1', 'year1-sem1-gened-slot-2'],
    'year1-sem2': ['252183', '261102', '261112', '305142', '305122', '305132', '305191', '305102', 'year1-sem2-gened-slot-1', 'year1-sem2-gened-slot-2'],
    'year1-summer': ['305193'],
    'year2-sem1': ['252284', '305241', '305232', '305230', '305291', '305201', 'year2-sem1-gened-slot-1', 'year2-sem1-gened-slot-2'],
    'year2-sem2': ['305233', '305245', '305231', '305242', '305221', '305292', '305202', 'year2-sem2-gened-slot-1', 'year2-sem2-gened-slot-2'],
    'year2-summer': ['305293'],
    'year3-sem1': ['305341', '300302', '305311', '305331', '305343', '305391', '305301', 'year3-sem1-gened-slot-1', 'year3-sem1-free-elective-slot-1'],
    'year3-sem2': ['305342', '300301', '305334', '305335', '305323', '305392', 'year3-sem2-gened-slot-1', 'year3-sem2-free-elective-slot-1'],
    'year3-summer': ['305393'],
    'year4-sem1': ['305491', '305493', '305495', 'year4-sem1-major-elective-slot-1'],
    'year4-sem2': ['305492', '305494', '305496', 'year4-sem2-major-elective-slot-1']
}

with open("src/data/studyPlan.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Very naive extraction of courseId and code per semester
semesters = re.findall(r'"id":\s*"([^"]+)"(.*?)(?="id":|"sourceFile":)', content, re.DOTALL)

for sem_id, sem_content in semesters:
    if sem_id not in exact_order:
        print(f"Unknown semester: {sem_id}")
        continue
    
    courses_in_sem = re.findall(r'\{([^{}]+)\}', sem_content)
    found_ids = []
    for c in courses_in_sem:
        code_match = re.search(r'"code":\s*"([^"]+)"', c)
        id_match = re.search(r'"courseId":\s*"([^"]+)"', c)
        if code_match and id_match:
            code = code_match.group(1)
            courseId = id_match.group(1)
            resolved_id = courseId if code in ['001XXX', 'XXXXXX'] else code
            found_ids.append(resolved_id)
            
    expected = exact_order[sem_id]
    
    extra = [fid for fid in found_ids if fid not in expected]
    if extra:
        print(f"{sem_id} has extra courses: {extra}")

