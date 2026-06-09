// Auto-migrated from ../src/data/dependencies.js. Preserve source fields when editing.
export const dependencies = {
  "chains": [
    {
      "id": "calculus-chain",
      "title": "Calculus Chain",
      "titleTh": "สายแคลคูลัส",
      "category": "Math & Science",
      "dangerLevel": "critical",
      "description": "แคลคูลัสเป็นฐานของวิศวกรรม คณิตศาสตร์ สถิติ AI และสัญญาณ ถ้าติด F ตัวแรก ตัวถัดไปจะรวนทันที",
      "seniorWarning": "Calc 1 อย่าปล่อยผ่านเด็ดขาด เพราะมันลาก Calc 2 และ Calc 3 ต่อ",
      "nodes": [
        "calculus-1",
        "calculus-2",
        "calculus-3"
      ]
    },
    {
      "id": "physics-chain",
      "title": "Physics Chain",
      "titleTh": "สายฟิสิกส์",
      "category": "Math & Science",
      "dangerLevel": "critical",
      "description": "ฟิสิกส์เป็นฐานของวิศวกรรม โดยเฉพาะความเข้าใจเรื่องไฟฟ้า อิเล็กทรอนิกส์ สัญญาณ และระบบจริง",
      "seniorWarning": "Physics 1 และ Physics 2 มักเป็นวิชาที่ทำให้เด็กปี 1 เสียจังหวะ ถ้าเริ่มไม่เข้าใจให้รีบถาม อย่ารอถึงก่อนสอบ",
      "nodes": [
        "physics-1",
        "physics-2",
        "lab-physics-1",
        "lab-physics-2"
      ]
    },
    {
      "id": "programming-chain",
      "title": "Programming Foundation Chain",
      "titleTh": "สายพื้นฐานเขียนโปรแกรม",
      "category": "Programming",
      "dangerLevel": "critical",
      "description": "นี่คือกระดูกสันหลังของสายคอมพิวเตอร์ ถ้า Programming 1 ไม่แน่น วิชาหลังจากนี้จะเหนื่อยมาก โดยเฉพาะ Data Structures and Algorithms, Software Engineering, Database, Operating Systems และ AI",
      "seniorWarning": "เขียนโค้ดต้องฝึกเอง อ่านอย่างเดียวไม่พอ และอย่า Copy งานจนผ่านไปแบบไม่เข้าใจ เพราะจะย้อนมาหนักกว่าเดิมในปี 2",
      "nodes": [
        "computer-programming-1",
        "computer-programming-2",
        "data-structures-and-algorithms"
      ]
    },
    {
      "id": "discrete-math-chain",
      "title": "Discrete Mathematics Chain",
      "titleTh": "สายคณิตศาสตร์ไม่ต่อเนื่อง",
      "category": "Math & Science",
      "dangerLevel": "high",
      "description": "Discrete Mathematics เป็นฐานของ logic, proof, graph, algorithm, computation theory, AI, security และ network บางส่วน ถึงจะดูไม่เหมือนเขียนโปรแกรม แต่สำคัญมาก",
      "seniorWarning": "หลายคนไม่ชอบเพราะมันเป็นคณิตแบบนามธรรม แต่ถ้าเข้าใจ จะช่วยให้เรียน Algorithm และ Security ง่ายขึ้นมาก",
      "nodes": [
        "discrete-mathematics-1",
        "discrete-mathematics-2"
      ]
    },
    {
      "id": "hardware-chain",
      "title": "Hardware / Digital System Chain",
      "titleTh": "สายฮาร์ดแวร์และระบบดิจิทัล",
      "category": "Hardware",
      "dangerLevel": "critical",
      "description": "Digital Logic คือฐานของคอมพิวเตอร์ระดับฮาร์ดแวร์ ตั้งแต่ logic gate, flip-flop, register, memory, CPU concept ไปจนถึง embedded systems",
      "seniorWarning": "อย่ามอง Digital Logic เป็นแค่วิชาวงจร เพราะมันคือภาษาพื้นฐานของ CPU และ Hardware ทั้งหมด",
      "nodes": [
        "digital-logic",
        "computer-architecture-and-organization",
        "embedded-system-1",
        "embedded-system-2"
      ]
    },
    {
      "id": "circuit-chain",
      "title": "Circuit / Electronics Chain",
      "titleTh": "สายวงจรและอิเล็กทรอนิกส์",
      "category": "Hardware",
      "dangerLevel": "high",
      "description": "วงจรไฟฟ้าและอิเล็กทรอนิกส์เป็นฐานของสาย Embedded, IoT, Sensor, Robotics และ Hardware",
      "seniorWarning": "ถ้าอยากไปสาย Embedded หรือ IoT อย่าทิ้งวงจรกับอิเล็กทรอนิกส์ เพราะเวลาทำโปรเจกต์จริงจะเจอปัญหาไฟเลี้ยง สัญญาณ และอุปกรณ์จริง",
      "nodes": [
        "electrical-circuit-for-computer-engineering",
        "electronics-for-computer-engineering"
      ]
    },
    {
      "id": "network-security-chain",
      "title": "Network and Security Chain",
      "titleTh": "สายเครือข่ายและความมั่นคงปลอดภัย",
      "category": "Network & Security",
      "dangerLevel": "high",
      "description": "Network เป็นฐานของระบบอินเทอร์เน็ต Server, Cloud, Security, DevOps และ Infrastructure ถ้าไม่เข้าใจ Network จะเรียน Security ได้ยากขึ้น",
      "seniorWarning": "สาย Security ไม่ใช่แค่ใช้ Tool เป็น แต่ต้องเข้าใจ Network, OS, Web, Logs และพื้นฐานระบบจริง",
      "nodes": [
        "computer-networks",
        "computer-and-information-security"
      ]
    },
    {
      "id": "ai-data-chain",
      "title": "Statistics / AI / Data Chain",
      "titleTh": "สายสถิติและปัญญาประดิษฐ์",
      "category": "AI & Data",
      "dangerLevel": "high",
      "description": "AI และ Data ไม่ใช่แค่เขียน Python แต่ต้องเข้าใจ probability, statistics, model evaluation และการตีความข้อมูล",
      "seniorWarning": "ถ้าอยากไปสาย AI ให้เริ่มเก็บคณิตกับสถิติตั้งแต่ปี 1-2 ไม่ใช่รอเรียน AI แล้วค่อยเริ่ม",
      "nodes": [
        "probability-and-statistics",
        "applied-statistics",
        "artificial-intelligence"
      ]
    },
    {
      "id": "software-engineering-chain",
      "title": "Software Engineering Chain",
      "titleTh": "สายวิศวกรรมซอฟต์แวร์",
      "category": "Programming",
      "dangerLevel": "medium",
      "description": "Software Engineering เชื่อมจากการเขียนโค้ดคนเดียว ไปสู่การทำระบบจริงเป็นทีม มี requirement, design, testing, maintenance และ project management",
      "seniorWarning": "ถ้าทำโปรเจกต์มั่วตั้งแต่ปี 2-3 ปี 4 จะเหนื่อยมาก เพราะ Engineering Project ต้องใช้ทั้ง coding, documentation และ teamwork",
      "nodes": [
        "systems-and-software-engineering",
        "engineering-project-1"
      ]
    },
    {
      "id": "year-4-tracks",
      "title": "Year 4 Track Chains",
      "titleTh": "สายโปรเจกต์และการวิจัย",
      "category": "Year 4",
      "dangerLevel": "medium",
      "description": "ปี 4 เป็นช่วงเปลี่ยนจากนิสิตไปเป็นคนทำงานหรือคนทำวิจัย แต่ละแผนต้องใช้การเตรียมตัวต่างกัน",
      "seniorWarning": "อย่ารอปี 4 แล้วค่อยเริ่มคิดว่าจะทำอะไร เพราะ Project / Practicum / Research ต้องใช้ portfolio, skill, advisor, team และเวลาสะสม",
      "nodes": [
        "engineering-project-1",
        "engineering-project-2",
        "industry-practicum-1",
        "industry-practicum-2",
        "undergraduate-research-1",
        "undergraduate-research-2"
      ]
    }
  ],
  "edges": [
    {
      "from": "calculus-1",
      "to": "calculus-2",
      "type": "prerequisite",
      "strength": "strong",
      "category": "Math & Science"
    },
    {
      "from": "calculus-2",
      "to": "calculus-3",
      "type": "prerequisite",
      "strength": "strong",
      "category": "Math & Science"
    },
    {
      "from": "physics-1",
      "to": "physics-2",
      "type": "prerequisite",
      "strength": "strong",
      "category": "Math & Science"
    },
    {
      "from": "lab-physics-1",
      "to": "lab-physics-2",
      "type": "prerequisite",
      "strength": "medium",
      "category": "Math & Science"
    },
    {
      "from": "computer-programming-1",
      "to": "computer-programming-2",
      "type": "prerequisite",
      "strength": "strong",
      "category": "Programming"
    },
    {
      "from": "computer-programming-2",
      "to": "data-structures-and-algorithms",
      "type": "prerequisite",
      "strength": "strong",
      "category": "Programming"
    },
    {
      "from": "discrete-mathematics-1",
      "to": "discrete-mathematics-2",
      "type": "prerequisite",
      "strength": "strong",
      "category": "Math & Science"
    },
    {
      "from": "discrete-mathematics-2",
      "to": "data-structures-and-algorithms",
      "type": "conceptual",
      "strength": "medium",
      "category": "Math & Science"
    },
    {
      "from": "digital-logic",
      "to": "computer-architecture-and-organization",
      "type": "prerequisite",
      "strength": "strong",
      "category": "Hardware"
    },
    {
      "from": "computer-architecture-and-organization",
      "to": "embedded-system-1",
      "type": "prerequisite",
      "strength": "strong",
      "category": "Hardware"
    },
    {
      "from": "embedded-system-1",
      "to": "embedded-system-2",
      "type": "prerequisite",
      "strength": "strong",
      "category": "Hardware"
    },
    {
      "from": "electrical-circuit-for-computer-engineering",
      "to": "electronics-for-computer-engineering",
      "type": "prerequisite",
      "strength": "strong",
      "category": "Hardware"
    },
    {
      "from": "electronics-for-computer-engineering",
      "to": "embedded-system-1",
      "type": "conceptual",
      "strength": "medium",
      "category": "Hardware"
    },
    {
      "from": "computer-networks",
      "to": "computer-and-information-security",
      "type": "conceptual",
      "strength": "strong",
      "category": "Network & Security"
    },
    {
      "from": "computer-networks",
      "to": "cybersecurity",
      "type": "conceptual",
      "strength": "strong",
      "category": "Network & Security"
    },
    {
      "from": "computer-and-information-security",
      "to": "cybersecurity",
      "type": "conceptual",
      "strength": "strong",
      "category": "Network & Security"
    },
    {
      "from": "probability-and-statistics",
      "to": "applied-statistics",
      "type": "prerequisite",
      "strength": "strong",
      "category": "AI & Data"
    },
    {
      "from": "applied-statistics",
      "to": "artificial-intelligence",
      "type": "conceptual",
      "strength": "medium",
      "category": "AI & Data"
    },
    {
      "from": "artificial-intelligence",
      "to": "machine-learning",
      "type": "conceptual",
      "strength": "strong",
      "category": "AI & Data"
    },
    {
      "from": "data-structures-and-algorithms",
      "to": "database",
      "type": "conceptual",
      "strength": "medium",
      "category": "Programming"
    },
    {
      "from": "data-structures-and-algorithms",
      "to": "operating-systems",
      "type": "conceptual",
      "strength": "strong",
      "category": "Programming"
    },
    {
      "from": "data-structures-and-algorithms",
      "to": "systems-and-software-engineering",
      "type": "conceptual",
      "strength": "medium",
      "category": "Programming"
    },
    {
      "from": "systems-and-software-engineering",
      "to": "engineering-project-1",
      "type": "conceptual",
      "strength": "medium",
      "category": "Year 4"
    },
    {
      "from": "engineering-project-1",
      "to": "engineering-project-2",
      "type": "sequence",
      "strength": "strong",
      "category": "Year 4"
    },
    {
      "from": "industry-practicum-1",
      "to": "industry-practicum-2",
      "type": "sequence",
      "strength": "strong",
      "category": "Year 4"
    },
    {
      "from": "undergraduate-research-1",
      "to": "undergraduate-research-2",
      "type": "sequence",
      "strength": "strong",
      "category": "Year 4"
    }
  ]
};
