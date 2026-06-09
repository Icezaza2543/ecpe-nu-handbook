// Auto-migrated from ../src/data/year4Tracks.js. Preserve source fields when editing.
export const year4Tracks = [
  {
    "id": "engineering-project",
    "title": "แผนปกติ (Engineering Project Track)",
    "description": "แผนดั้งเดิมที่เน้นการเรียนวิชาเลือกเชิงลึกควบคู่ไปกับการทำโปรเจกต์จบในมหาวิทยาลัย",
    "officialCourses": [
      "305491",
      "305492"
    ],
    "electiveCredits": 6,
    "totalCredits": 12,
    "courses": [
      {
        "code": "305491",
        "courseId": "305491-computer-engineering-project-1",
        "name": "โครงงานด้านวิศวกรรมคอมพิวเตอร์ 1",
        "credits": "3",
        "semester": "1",
        "counted": true
      },
      {
        "code": "305492",
        "courseId": "305492-computer-engineering-project-2",
        "name": "โครงงานด้านวิศวกรรมคอมพิวเตอร์ 2",
        "credits": "3",
        "semester": "2",
        "counted": true
      },
      {
        "id": "major-elective-slot",
        "name": "วิชาเลือกทางวิศวกรรม 305xxx",
        "credits": 6,
        "counted": true
      }
    ],
    "sequence": [
      {
        "from": "305491",
        "to": "305492",
        "type": "official-prerequisite",
        "sourcePage": "หน้า 86"
      }
    ],
    "condition": "ต้องสอบผ่าน Project 1 ก่อนจึงจะลง Project 2 ได้",
    "conditionConfidence": "verified-official",
    "bestFor": "นิสิตที่ต้องการเก็บตกรายวิชาเลือกที่สนใจเพิ่มเติม และต้องการพัฒนาโปรเจกต์จบแบบเต็มรูปแบบภายใต้การดูแลของอาจารย์ที่ปรึกษาในคณะ",
    "portfolioOutcome": "เหมาะกับการสร้างผลงาน/ชิ้นงานเพื่อนำไปใช้เป็น Portfolio สมัครงาน",
    "interpretationConfidence": "senior-advice",
    "sourceConfidence": "verified-official",
    "sourceFile": "หลักสูตร.md",
    "sourcePage": "หน้า 86"
  },
  {
    "id": "industry-practicum",
    "title": "แผนเน้นการปฏิบัติงาน (Industry Practicum Track)",
    "description": "เน้นการออกไปทำงานในสถานประกอบการจริงตลอดทั้งปี",
    "officialCourses": [
      "305493",
      "305494"
    ],
    "electiveCredits": 0,
    "totalCredits": 12,
    "courses": [
      {
        "code": "305493",
        "courseId": "305493-industry-practicum-1",
        "name": "การปฏิบัติงานในอุตสาหกรรม 1",
        "credits": "6",
        "semester": "1",
        "counted": true
      },
      {
        "code": "305494",
        "courseId": "305494-industry-practicum-2",
        "name": "การปฏิบัติงานในอุตสาหกรรม 2",
        "credits": "6",
        "semester": "2",
        "counted": true
      }
    ],
    "sequence": [
      {
        "from": "305493",
        "to": "305494",
        "type": "official-prerequisite",
        "sourcePage": "หน้า 86"
      }
    ],
    "condition": "ต้องสอบผ่านวิชาบังคับทั้งหมดในหลักสูตรก่อน และต้องได้รับอนุมัติจากอาจารย์ประจำวิชาก่อนออกไปทำงาน",
    "conditionConfidence": "verified-official",
    "bestFor": "นิสิตที่ต้องการประสบการณ์ทำงานจริงอย่างเข้มข้นในบริษัท หรืออุตสาหกรรมซอฟต์แวร์/ฮาร์ดแวร์ก่อนเรียนจบ",
    "portfolioOutcome": "เหมาะกับสายที่ต้องการทำงานได้ทันที และอาจต่อยอดเป็นการจ้างงานหลังเรียนจบ",
    "interpretationConfidence": "senior-advice",
    "sourceConfidence": "verified-official",
    "sourceFile": "หลักสูตร.md",
    "sourcePage": "หน้า 86"
  },
  {
    "id": "undergraduate-research",
    "title": "แผนเน้นการวิจัย (Undergraduate Research Track)",
    "description": "แผนสำหรับผู้ที่เตรียมตัวเรียนต่อระดับบัณฑิตศึกษา หรือสนใจงานวิจัยเชิงลึก",
    "officialCourses": [
      "305495",
      "305496"
    ],
    "electiveCredits": 0,
    "totalCredits": 12,
    "courses": [
      {
        "code": "305495",
        "courseId": "305495-undergraduate-research-1",
        "name": "วิจัยระดับปริญญาตรี 1",
        "credits": "6",
        "semester": "1",
        "counted": true
      },
      {
        "code": "305496",
        "courseId": "305496-undergraduate-research-2",
        "name": "วิจัยระดับปริญญาตรี 2",
        "credits": "6",
        "semester": "2",
        "counted": true
      }
    ],
    "sequence": [
      {
        "from": "305495",
        "to": "305496",
        "type": "official-prerequisite",
        "sourcePage": "หน้า 87"
      }
    ],
    "condition": "ต้องผ่านวิชาบังคับทั้งหมดในหลักสูตรก่อน และผลงานการวิจัยต้องได้รับการตีพิมพ์ในวารสารทางวิชาการ หรือนำเสนอในงานประชุมวิชาการ จึงจะสำเร็จการศึกษาได้",
    "conditionConfidence": "verified-official",
    "bestFor": "นิสิตที่สนใจเจาะลึกองค์ความรู้ใหม่ งานวิจัย ทฤษฎีใหม่ หรือเตรียมเรียนต่อ",
    "portfolioOutcome": "เหมาะกับการสะสมผลงานวิชาการเพื่อยื่นทุนหรือเรียนต่อระดับบัณฑิตศึกษา",
    "interpretationConfidence": "senior-advice",
    "sourceConfidence": "verified-official",
    "sourceFile": "หลักสูตร.md",
    "sourcePage": "หน้า 87"
  }
];
