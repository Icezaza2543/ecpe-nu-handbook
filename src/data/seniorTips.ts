// Auto-migrated from ../src/data/seniorTips.js. Preserve source fields when editing.
export const seniorTips = {
  "intro": {
    "title": "Senior Tips: รุ่นพี่อยากบอก",
    "subtitle": "คำแนะนำที่ไม่ได้อยู่ใน มคอ. แต่ช่วยให้น้องรอดในชีวิตวิศวคอม",
    "disclaimer": "FAQ และ Senior Tips นี้เป็นคำแนะนำจากรุ่นพี่ ควรตรวจสอบข้อมูลทางการกับมหาวิทยาลัยอีกครั้ง"
  },
  "groups": [
    {
      "id": "study-mindset",
      "title": "วิธีเรียนให้รอด",
      "emoji": "📚",
      "description": "พื้นฐานการเอาตัวรอดในวิศวคอมไม่ใช่การเก่งทุกอย่าง แต่คือการมีระบบเรียนที่สม่ำเสมอ",
      "tips": [
        {
          "id": "tip-attend-class",
          "title": "เข้าเรียนให้พอรู้จังหวะวิชา",
          "content": "บางวิชาดูเหมือนอ่านเองได้ แต่จริง ๆ การเข้าเรียนช่วยให้รู้ว่าอาจารย์เน้นอะไร ส่งงานยังไง และสอบประมาณไหน เดือนแรกควรเข้าให้ครบที่สุดเพื่อจับ pattern ของแต่ละวิชา",
          "type": "study",
          "priority": "high",
          "relatedCourses": [
            "calculus-1",
            "physics-1",
            "computer-programming-1"
          ]
        },
        {
          "id": "tip-calc-physics",
          "title": "อ่านวิชาคำนวณด้วยการทำโจทย์",
          "content": "Calculus และ Physics ไม่ใช่วิชาที่อ่านสรุปแล้วรอดเสมอไป ต้องทำโจทย์เอง เห็นข้อผิดพลาดเอง และฝึกหลายรอบจนเริ่มจำ pattern ได้",
          "type": "study",
          "priority": "high",
          "relatedCourses": [
            "calculus-1",
            "physics-1"
          ]
        },
        {
          "id": "tip-dont-accumulate",
          "title": "อย่าสะสมความไม่เข้าใจ",
          "content": "วิศวคอมมีวิชาต่อกันเป็นชั้น ๆ ถ้างงบทแรกแล้วปล่อยไว้ บทหลังจะหนักขึ้นเรื่อย ๆ ถ้างงให้ถามตั้งแต่ยังเล็ก อย่ารอจนมันกลายเป็นกำแพง",
          "type": "study",
          "priority": "high",
          "relatedCourses": [
            "calculus-1",
            "computer-programming-1",
            "discrete-mathematics-1"
          ]
        },
        {
          "id": "tip-summary",
          "title": "ทำสรุปแบบที่ตัวเองกลับมาอ่านรู้เรื่อง",
          "content": "Note ที่ดีไม่จำเป็นต้องสวย แต่ต้องช่วยให้ตัวเองกลับมาเข้าใจเร็วขึ้น เขียนสูตร ตัวอย่างโจทย์ bug ที่เจอ และข้อผิดพลาดของตัวเองไว้",
          "type": "study",
          "priority": "medium",
          "relatedCourses": []
        },
        {
          "id": "tip-study-with-friends",
          "title": "เรียนกับเพื่อนได้ แต่ต้องทำเองเป็น",
          "content": "การอ่านกับเพื่อนดีมาก แต่ต้องระวังการเข้าใจปลอม ๆ เพราะนั่งฟังเพื่อนอธิบายแล้วคิดว่าตัวเองทำได้ สุดท้ายต้องลองทำโจทย์หรือเขียนโค้ดคนเดียวด้วย",
          "type": "study",
          "priority": "high",
          "relatedCourses": []
        }
      ]
    },
    {
      "id": "dangerous-courses",
      "title": "วิชาที่ต้องระวัง",
      "emoji": "⚠️",
      "description": "บางวิชาอันตรายเพราะยาก บางวิชาอันตรายเพราะเป็นตัวต่อ และบางวิชาเป็นทั้งสองอย่าง",
      "tips": [
        {
          "id": "tip-no-f-prereq",
          "title": "อย่าติด F วิชาตัวต่อ",
          "content": "วิชาตัวต่อคือวิชาที่ต้องผ่านตัวก่อนหน้าเพื่อไปเรียนตัวถัดไป ถ้าติด F จะไม่ได้เสียแค่ GPA แต่ทำให้แผนการเรียนรวนและเสี่ยงจบช้า",
          "type": "courses",
          "priority": "critical",
          "relatedCourses": [
            "calculus-1",
            "calculus-2",
            "physics-1",
            "computer-programming-1",
            "computer-programming-2",
            "data-structures-and-algorithms",
            "digital-logic"
          ]
        },
        {
          "id": "tip-calc1-domino",
          "title": "Calculus 1 คือประตูแรก",
          "content": "ถ้า Calculus 1 ไม่ผ่านหรือไม่เข้าใจ จะกระทบ Calculus 2 และ 3 ต่อทันที อย่าปล่อยให้พังตั้งแต่ตัวแรก",
          "type": "courses",
          "priority": "critical",
          "relatedCourses": [
            "calculus-1",
            "calculus-2",
            "calculus-3"
          ]
        },
        {
          "id": "tip-prog-self",
          "title": "Programming 1-2 ต้องเขียนเอง",
          "content": "ถ้าผ่าน Programming 1-2 ด้วยการดูเพื่อนหรือ copy code อย่างเดียว ปี 2 จะเจ็บหนักตอน Data Structures and Algorithms",
          "type": "courses",
          "priority": "critical",
          "relatedCourses": [
            "computer-programming-1",
            "computer-programming-2",
            "data-structures-and-algorithms"
          ]
        },
        {
          "id": "tip-digital-logic",
          "title": "Digital Logic ไม่ใช่วิชาเล็ก",
          "content": "Digital Logic เป็นฐานของ Computer Architecture และ Embedded System ถ้าอยากไปสาย hardware, IoT หรือ embedded ห้ามทิ้งวิชานี้",
          "type": "courses",
          "priority": "high",
          "relatedCourses": [
            "digital-logic",
            "computer-architecture-and-organization",
            "embedded-system-1"
          ]
        },
        {
          "id": "tip-dsa-core",
          "title": "DSA คือวิชาวัดแกนคอม",
          "content": "Data Structures and Algorithms เชื่อมกับการเขียนระบบจริง การสัมภาษณ์งาน และการคิดแก้ปัญหาแบบคอมพิวเตอร์ ควรให้เวลาอย่างจริงจัง",
          "type": "courses",
          "priority": "critical",
          "relatedCourses": [
            "data-structures-and-algorithms"
          ]
        }
      ]
    },
    {
      "id": "gpa-exams",
      "title": "การสอบและ GPA",
      "emoji": "🧮",
      "description": "เกรดไม่ใช่ทุกอย่าง แต่เกรดที่พังเกินไปจะทำให้ชีวิตเหนื่อยโดยไม่จำเป็น",
      "tips": [
        {
          "id": "tip-keep-scores",
          "title": "อย่าทิ้งคะแนนเก็บ",
          "content": "คะแนนเก็บช่วยชีวิตได้มาก โดยเฉพาะวิชาหนัก ถ้าคะแนนสอบไม่ดีแต่คะแนนเก็บแน่น ยังพอประคองได้ อย่าปล่อยงานเล็ก ๆ ให้หายฟรี",
          "type": "exams",
          "priority": "high",
          "relatedCourses": []
        },
        {
          "id": "tip-check-score",
          "title": "เช็กคะแนนตัวเองก่อน Final",
          "content": "ก่อน Final ควรรู้ว่าตัวเองมีคะแนนประมาณไหน ต้องการอีกเท่าไร และวิชาไหนเสี่ยงที่สุด จะได้วางแผนอ่านตามความเสี่ยง ไม่ใช่อ่านตามความชอบ",
          "type": "exams",
          "priority": "high",
          "relatedCourses": []
        },
        {
          "id": "tip-gened-helps",
          "title": "GenEd ช่วยพยุง GPA ได้",
          "content": "อย่ามองวิชาศึกษาทั่วไปว่าไม่สำคัญ หลายตัวเป็นโอกาสเก็บเกรดที่ดี แต่ก็ต้องไม่ทิ้งวิชาแกนเพื่อไปทุ่ม GenEd อย่างเดียว",
          "type": "exams",
          "priority": "medium",
          "relatedCourses": []
        },
        {
          "id": "tip-ask-for-help",
          "title": "ถ้าเริ่มเสี่ยง ให้รีบคุยกับคนที่ช่วยได้",
          "content": "ถ้าคะแนนเริ่มอันตราย อย่าหายเงียบ ให้รีบคุยกับอาจารย์ที่ปรึกษา รุ่นพี่ หรือเพื่อนที่ไว้ใจได้ การแก้เร็วช่วยลดความเสียหายได้มาก",
          "type": "exams",
          "priority": "high",
          "relatedCourses": []
        }
      ]
    },
    {
      "id": "programming-lab",
      "title": "Programming และ Lab",
      "emoji": "💻",
      "description": "วิชาโค้ดและ lab วัดจากการทำเอง ยิ่งทำเองเร็ว ยิ่งโตเร็ว",
      "tips": [
        {
          "id": "tip-type-code",
          "title": "พิมพ์โค้ดเองเสมอ",
          "content": "ต่อให้ดูตัวอย่างได้ แต่สุดท้ายควรพิมพ์เอง แก้เอง และลองเปลี่ยนเอง เพราะทักษะ programming เกิดจากการลงมือ ไม่ใช่การมอง",
          "type": "lab",
          "priority": "critical",
          "relatedCourses": [
            "computer-programming-1",
            "computer-programming-2"
          ]
        },
        {
          "id": "tip-debug-skill",
          "title": "Debug คือทักษะ ไม่ใช่ความล้มเหลว",
          "content": "เจอ bug ไม่ได้แปลว่าไม่เก่ง แต่เป็นส่วนหนึ่งของการเรียนเขียนโปรแกรม คนที่ debug เป็นจะโตเร็วมาก",
          "type": "lab",
          "priority": "high",
          "relatedCourses": [
            "computer-programming-1",
            "computer-programming-2"
          ]
        },
        {
          "id": "tip-dont-copy",
          "title": "อย่า Copy โค้ดถ้ายังไม่เข้าใจ",
          "content": "การเอา StackOverflow หรือ AI มาใช้ทำได้ แต่ต้องแน่ใจว่าถ้าให้อธิบายทีละบรรทัด เราสามารถตอบได้ว่าโค้ดนั้นทำงานอย่างไร",
          "type": "lab",
          "priority": "high",
          "relatedCourses": []
        }
      ]
    },
    {
      "id": "portfolio",
      "title": "Portfolio",
      "emoji": "📂",
      "description": "Portfolio คือหลักฐานว่าเราไม่ได้มีแค่ใบปริญญา แต่ทำของจริงเป็น",
      "tips": [
        {
          "id": "tip-readme",
          "title": "README สำคัญพอๆ กับ Code",
          "content": "โปรเจกต์ที่โค้ดดีแค่ไหน ถ้าคนเปิดมาไม่รู้ว่ามันคืออะไร รันยังไง ก็แทบไม่มีประโยชน์ หัดเขียน README ให้อ่านง่าย มีรูป มีตัวอย่าง",
          "type": "portfolio",
          "priority": "high",
          "relatedCourses": []
        },
        {
          "id": "tip-finish-project",
          "title": "โปรเจกต์เล็กที่เสร็จ ดีกว่าโปรเจกต์ใหญ่ที่พัง",
          "content": "เริ่มทำของเล็กๆ เช่น Todo App, เครื่องคิดเลข, บอทง่ายๆ ทำให้เสร็จแล้วเอาขึ้น GitHub มันดูดีกว่าโปรเจกต์ใหญ่โตที่รันไม่ขึ้น",
          "type": "portfolio",
          "priority": "high",
          "relatedCourses": []
        }
      ]
    },
    {
      "id": "internship",
      "title": "Internship",
      "emoji": "🏢",
      "description": "การฝึกงานคือโอกาสลงสนามจริงก่อนจบ",
      "tips": [
        {
          "id": "tip-prepare-early",
          "title": "อย่ารอหาที่ฝึกงานตอนวินาทีสุดท้าย",
          "content": "บริษัทดีๆ มักจะเปิดรับสมัครและปิดรับสมัครเร็วกว่าที่คิด เริ่มหาข้อมูลตั้งแต่เทอม 1 ของปี 3 หรือช่วงปิดเทอมปี 2 เลยยิ่งดี",
          "type": "internship",
          "priority": "high",
          "relatedCourses": [
            "training-in-computer-engineering"
          ]
        },
        {
          "id": "tip-interview-prep",
          "title": "สัมภาษณ์คือการดูทัศนคติ",
          "content": "หลายบริษัทไม่ได้คาดหวังให้นักศึกษาฝึกงานรู้ทุกเรื่อง แต่เขาดูว่าเราพร้อมเรียนรู้ไหม อธิบายสิ่งที่เราทำเป็นไหม และพูดคุยรู้เรื่องหรือเปล่า",
          "type": "internship",
          "priority": "medium",
          "relatedCourses": []
        }
      ]
    },
    {
      "id": "career-path",
      "title": "การเลือกสาย",
      "emoji": "🛣️",
      "description": "โลกของวิศวคอมพิวเตอร์กว้างมาก ลองให้เยอะเพื่อหาจุดที่ใช่",
      "tips": [
        {
          "id": "tip-try-everything",
          "title": "ลองให้รู้ว่าไม่ชอบ ก็ถือว่ามีประโยชน์",
          "content": "การทำโปรเจกต์ AI แล้วพบว่าไม่ชอบเลข หรือทำ Web แล้วปวดหัวกับ CSS ไม่ใช่ความล้มเหลว มันช่วยตัดตัวเลือกให้เราเจอสิ่งที่ใช่จริงๆ",
          "type": "career",
          "priority": "medium",
          "relatedCourses": []
        }
      ]
    },
    {
      "id": "campus-life",
      "title": "กิจกรรมและเพื่อน",
      "emoji": "🤝",
      "description": "มหาวิทยาลัยไม่ได้มีแค่ห้องเรียนและหน้าจอคอม",
      "tips": [
        {
          "id": "tip-connections",
          "title": "Connection สำคัญไม่แพ้ Code",
          "content": "เพื่อน รุ่นพี่ รุ่นน้อง หรืออาจารย์ อาจเป็นคนแนะนำงาน ดีลโปรเจกต์ หรือให้คำปรึกษาเราในอนาคต รักษาความสัมพันธ์ไว้ให้ดี",
          "type": "life",
          "priority": "medium",
          "relatedCourses": []
        }
      ]
    },
    {
      "id": "mental-health",
      "title": "สุขภาพใจและการจัดเวลา",
      "emoji": "🧘",
      "description": "คอมพิวเตอร์ทำงานหนักยังพัง คนเราก็ต้องการการพักผ่อน",
      "tips": [
        {
          "id": "tip-sleep",
          "title": "การนอนคือการ Debug ที่ดีที่สุด",
          "content": "ถ้านั่งงมโค้ดมา 3 ชั่วโมงแล้วแก้ไม่ได้ ลองไปนอน บางครั้งตื่นมา 10 นาทีแรกก็แก้ได้เลย อย่าฝืนจนร่างกายพัง",
          "type": "health",
          "priority": "critical",
          "relatedCourses": []
        },
        {
          "id": "tip-burnout",
          "title": "ระวังอาการ Burnout",
          "content": "การอยากเก่งเป็นเรื่องดี แต่ถ้ากดดันตัวเองจนไม่อยากเปิดคอม นั่นคือสัญญาณเตือน หาเวลาพักไปทำอย่างอื่นบ้าง โลกไม่ได้มีแต่โค้ด",
          "type": "health",
          "priority": "high",
          "relatedCourses": []
        }
      ]
    },
    {
      "id": "ethics",
      "title": "จริยธรรมและความรับผิดชอบ",
      "emoji": "⚖️",
      "description": "วิศวกรที่ดีต้องมีความรับผิดชอบต่อสิ่งที่ตัวเองสร้าง",
      "tips": [
        {
          "id": "tip-no-hack",
          "title": "อย่าเอาความรู้ไปใช้ในทางที่ผิด",
          "content": "โดยเฉพาะสาย Security การเจาะระบบผู้อื่นโดยไม่ได้รับอนุญาตคืออาชญากรรม ไม่ใช่ความเท่ ทำอะไรให้มีขอบเขตและจริยธรรมเสมอ",
          "type": "ethics",
          "priority": "critical",
          "relatedCourses": [
            "computer-and-information-security"
          ]
        }
      ]
    }
  ]
};
