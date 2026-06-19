import type { SurvivalLink, SurvivalLinksBundle } from '../types/survivalLinks';

const linksList: SurvivalLink[] = [
  // CPE / ECPE / Faculty
  {
    id: 'cpe-nu-page',
    name: 'CPE.ecpe.nu',
    description: 'ข่าวเฉพาะสาขา CPE, ประกาศจากอาจารย์, กิจกรรมสาขา',
    url: 'https://www.facebook.com/CPE.ecpe.nu/',
    platform: 'facebook',
  },
  {
    id: 'ecpe-nu-page',
    name: 'ECPE NU',
    description: 'ข่าวรวมของภาค ECPE ทั้งไฟฟ้าและคอมพิวเตอร์',
    url: 'https://www.facebook.com/ecpe.nu/',
    platform: 'facebook',
  },
  {
    id: 'cpe-nu-activity',
    name: 'CPE NU',
    description: 'เพจประชาสัมพันธ์กิจกรรมในสาขา',
    url: 'https://www.facebook.com/p/CPE-NU-61559012107684/',
    platform: 'facebook',
  },
  {
    id: 'eng-nu-page',
    name: 'Engineering NU',
    description: 'ข่าวคณะ ประกาศกิจกรรม ประกาศงานวิชาการของคณะ',
    url: 'https://www.facebook.com/eng.nu/',
    platform: 'facebook',
  },
  {
    id: 'eng-academic-page',
    name: 'งานวิชาการ คณะวิศวกรรมศาสตร์',
    description: 'เรื่องเรียน คำร้อง ประกาศวิชาการของคณะ',
    url: 'https://www.facebook.com/p/งานวิชาการ-คณะวิศวกรรมศาสตร์-มหาวิทยาลัยนเรศวร-100057319694649/',
    platform: 'facebook',
  },
  {
    id: 'eng-smo-page',
    name: 'สโมสรนิสิตคณะวิศวกรรมศาสตร์',
    description: 'กิจกรรมคณะ เสื้อคณะ รับน้อง งานสโม งานนิสิต',
    url: 'https://www.facebook.com/smoennu/',
    platform: 'facebook',
  },
  {
    id: 'eng-website',
    name: 'เว็บไซต์คณะวิศวกรรมศาสตร์',
    description: 'ข่าวและข้อมูลทางการของคณะ',
    url: 'https://www.eng.nu.ac.th/',
    platform: 'website',
  },
  {
    id: 'eng-programs-page',
    name: 'หน้าหลักสูตรคณะวิศวกรรมศาสตร์',
    description: 'ดูหลักสูตรที่เปิดสอนในคณะ',
    url: 'https://www.eng.nu.ac.th/eng2022/course-study.php?MainN=003',
    platform: 'website',
  },
  {
    id: 'eng-handbook-65-69',
    name: 'คู่มือนิสิตคณะวิศวกรรมศาสตร์ ปี 2565–2569',
    description: 'อ่านกฎ ระเบียบ โครงสร้างหลักสูตร และข้อมูลสำคัญของคณะ',
    url: 'https://www.eng.nu.ac.th/eng2022/StudentHandbook6569.php',
    platform: 'website',
  },
  {
    id: 'cpe-curriculum-65',
    name: 'หลักสูตร วศ.บ. วิศวกรรมคอมพิวเตอร์ ปรับปรุง พ.ศ. 2565',
    description: 'โครงสร้างหลักสูตร CPE รายวิชา แผนการเรียน',
    url: 'https://www.eng.nu.ac.th/engineer/docs/course/Y65/barch/com_u_65.pdf',
    platform: 'pdf',
  },
  {
    id: 'eng-intern-system',
    name: 'ระบบจัดการการฝึกงาน คณะวิศวกรรมศาสตร์',
    description: 'ใช้ตอนเกี่ยวกับฝึกงาน/สหกิจ/เอกสารนักศึกษา',
    url: 'https://web.eng.nu.ac.th/student/',
    platform: 'website',
  },

  // University Systems
  {
    id: 'nu-website',
    name: 'เว็บไซต์หลัก มหาวิทยาลัยนเรศวร',
    description: 'ข่าวและข้อมูลกลางของมหาวิทยาลัย',
    url: 'https://www.nu.ac.th/',
    platform: 'website',
  },
  {
    id: 'nu-current-student',
    name: 'หน้านิสิตปัจจุบัน NU',
    description: 'หน้ารวมบริการสำหรับนิสิต เช่น REG, NU Mail, Office 365',
    url: 'https://www.nu.ac.th/?e-landing-page=นิสิตปัจจุบัน',
    platform: 'website',
  },
  {
    id: 'nu-reg',
    name: 'REG NU',
    description: 'ลงทะเบียนเรียน ตารางเรียน ตารางสอบ ผลการเรียน',
    url: 'https://reg.nu.ac.th/',
    platform: 'website',
  },
  {
    id: 'nu-reg-guide',
    name: 'คู่มือขั้นตอนการลงทะเบียน',
    description: 'วิธีใช้งานระบบทะเบียนออนไลน์',
    url: 'https://reg.nu.ac.th/enrollguide.htm',
    platform: 'website',
  },
  {
    id: 'nu-calendar',
    name: 'ปฏิทินการศึกษา',
    description: 'ดูวันเปิดเทอม ปิดเทอม เพิ่มถอนรายวิชา สอบ',
    url: 'https://reg4.nu.ac.th/',
    platform: 'website',
  },
  {
    id: 'nu-academic-division',
    name: 'กองบริการการศึกษา',
    description: 'ข่าววิชาการกลาง แบบฟอร์ม คำร้อง ข้อมูลหลักสูตร',
    url: 'https://ww3.acad.nu.ac.th/',
    platform: 'website',
  },
  {
    id: 'nu-page',
    name: 'มหาวิทยาลัยนเรศวร',
    description: 'ข่าวใหญ่ระดับมหาวิทยาลัย',
    url: 'https://www.facebook.com/nu.university/',
    platform: 'facebook',
  },
  {
    id: 'nu-pr-page',
    name: 'งานประชาสัมพันธ์ มหาวิทยาลัยนเรศวร',
    description: 'ข่าวประชาสัมพันธ์กลาง',
    url: 'https://www.facebook.com/p/งานประชาสัมพันธ์-มหาวิทยาลัยนเรศวร-100064753443862/',
    platform: 'facebook',
  },

  // IT / Wi-Fi / Mail
  {
    id: 'citcoms-page',
    name: 'CITCOMS',
    description: 'Wi-Fi, NU Mail, Office, ระบบ IT, Helpdesk',
    url: 'https://www.facebook.com/citcomsnu/',
    platform: 'facebook',
  },
  {
    id: 'citcoms-services',
    name: 'รวมบริการ IT สำหรับนิสิต NU',
    description: 'รวมวิธีใช้งาน NU Net, NU Wi-Fi, NU Mail, Microsoft 365 และบริการ IT',
    url: 'https://citcoms.office.nu.ac.th/it-services69/',
    platform: 'website',
  },
  {
    id: 'nu-mail',
    name: 'NU Mail',
    description: 'อีเมลมหาวิทยาลัย',
    url: 'https://numail.nu.ac.th/',
    platform: 'website',
  },
  {
    id: 'office-365',
    name: 'Microsoft 365 / Office',
    description: 'ใช้งาน Word, Excel, PowerPoint, Teams, OneDrive',
    url: 'https://www.office.com/',
    platform: 'website',
  },
  {
    id: 'nu-change-pwd',
    name: 'Change Password',
    description: 'เปลี่ยนรหัสผ่านบัญชีมหาวิทยาลัย',
    url: 'https://password.nu.ac.th/',
    platform: 'website',
  },
  {
    id: 'nu-ict-exam',
    name: 'NU ICT Exam',
    description: 'ระบบทดสอบความรู้ ICT',
    url: 'https://exam.nu.ac.th/',
    platform: 'website',
  },
  {
    id: 'nu-training',
    name: 'Training NU',
    description: 'คอร์สอบรม/ทักษะจากมหาวิทยาลัย',
    url: 'https://training.nu.ac.th/',
    platform: 'website',
  },
  {
    id: 'nu-online-skill',
    name: 'Online Skill Training',
    description: 'คอร์สเสริมทักษะออนไลน์',
    url: 'https://skill.nu.ac.th/',
    platform: 'website',
  },
  {
    id: 'nu-samart-skills',
    name: 'SamartSkills',
    description: 'คอร์สเสริมทักษะ เช่น AI / Digital Skill',
    url: 'https://training.nu.ac.th/samartskills',
    platform: 'website',
  },

  // English / CEPT
  {
    id: 'diald-page',
    name: 'DIALD / CEPT',
    description: 'ข่าว CEPT, เกณฑ์ภาษาอังกฤษ, English Discoveries, อบรมภาษา',
    url: 'https://www.facebook.com/nu.diald/',
    platform: 'facebook',
  },
  {
    id: 'diald-website',
    name: 'กองพัฒนาภาษาและกิจการต่างประเทศ',
    description: 'หน้าทางการเกี่ยวกับ CEPT, NU Writing และกิจการต่างประเทศ',
    url: 'https://www.nu.ac.th/?page_id=7616',
    platform: 'website',
  },
  {
    id: 'cept-info-post',
    name: 'โพสต์รวมเรื่อง CEPT',
    description: 'ใช้อ่านภาพรวมเรื่องการสอบ CEPT',
    url: 'https://www.facebook.com/nu.diald/posts/10162445051131078/',
    platform: 'post',
  },
  {
    id: 'eng-req-post',
    name: 'โพสต์เตือนเกณฑ์ภาษาอังกฤษ',
    description: 'ใช้ย้ำว่านิสิต ป.ตรี ต้องผ่านเกณฑ์ภาษาอังกฤษก่อนสำเร็จการศึกษา',
    url: 'https://www.facebook.com/nu.university/posts/1038929668276586/',
    platform: 'post',
  },

  // Student Affairs / Dorm / Funds
  {
    id: 'sa-page',
    name: 'กองกิจการนิสิต',
    description: 'หอพัก ทุน กยศ. สวัสดิการ กิจกรรมนิสิต',
    url: 'https://www.facebook.com/studentsNU/',
    platform: 'facebook',
  },
  {
    id: 'sa-website',
    name: 'เว็บไซต์กองกิจการนิสิต',
    description: 'ข่าวและข้อมูลทางการด้านกิจการนิสิต',
    url: 'https://www.sa.nu.ac.th/',
    platform: 'website',
  },
  {
    id: 'sa-year1-page',
    name: 'NU 1st Year Students',
    description: 'หน้ารวมข้อมูลสำหรับนิสิตปี 1',
    url: 'https://www.sa.nu.ac.th/?page_id=20337',
    platform: 'website',
  },
  {
    id: 'dorm-post',
    name: 'โพสต์/ข้อมูลหอพักนิสิต',
    description: 'ใช้ดูประกาศเรื่องหอพัก/รายงานตัวเข้าหอ',
    url: 'https://www.facebook.com/studentsNU/posts/1473247561267537/',
    platform: 'post',
  },

  // Library
  {
    id: 'lib-page',
    name: 'สำนักหอสมุด',
    description: 'เวลาเปิด-ปิด ห้องอ่านหนังสือ กิจกรรม ฐานข้อมูลออนไลน์',
    url: 'https://www.facebook.com/libnu/',
    platform: 'facebook',
  },
  {
    id: 'lib-website',
    name: 'เว็บไซต์สำนักหอสมุด',
    description: 'ค้นหาหนังสือ บริการห้องสมุด ฐานข้อมูลออนไลน์',
    url: 'https://www.lib.nu.ac.th/',
    platform: 'website',
  },
  {
    id: 'lib-databases',
    name: 'ฐานข้อมูลออนไลน์',
    description: 'ฐานข้อมูลวิชาการ/งานวิจัย',
    url: 'https://www.lib.nu.ac.th/?page_id=36840',
    platform: 'website',
  },
  {
    id: 'lib-vpn',
    name: 'เข้าใช้ฐานข้อมูลจากนอกมหาวิทยาลัย',
    description: 'วิธีใช้ OpenAthens / NU Google Account เพื่อเข้าใช้ฐานข้อมูล',
    url: 'https://www.lib.nu.ac.th/?p=38438',
    platform: 'website',
  },
  {
    id: 'lib-scitech-page',
    name: 'ห้องสมุดสาขาวิทยาศาสตร์และเทคโนโลยี',
    description: 'ห้องสมุดฝั่งสายวิทย์/วิศวะ',
    url: 'https://www.facebook.com/SciTechLibrary/',
    platform: 'facebook',
  },
  {
    id: 'eng-coworking-post',
    name: 'Co-working Space คณะวิศวะ',
    description: 'โพสต์เกี่ยวกับพื้นที่อ่านหนังสือที่คณะวิศวกรรมศาสตร์',
    url: 'https://www.facebook.com/libnu/posts/1326403326188633/',
    platform: 'post',
  },
];

export const getSurvivalLink = (id: string): SurvivalLink | undefined => {
  return linksList.find(link => link.id === id);
};

export const survivalLinksBundle: SurvivalLinksBundle = {
  intro: {
    title: 'รวมลิงก์ที่มีประโยชน์',
    subtitle: 'รวมช่องทางที่ควรกดติดตามและบันทึกไว้ เน้นการใช้งานจริงหลังเข้าเรียน',
    lastUpdated: '20 มิถุนายน 2569',
  },
  disclaimer: [
    'ลิงก์ Facebook บางหน้าอาจเปลี่ยน URL หรือถูกตั้งค่าเป็นเพจ/กลุ่มปิดได้ในอนาคต',
    'ถ้าเป็นเรื่องด่วน เช่น ลงทะเบียนเรียน สอบ CEPT หอพัก ทุน หรือระบบ IT ควรเช็กจากเว็บทางการควบคู่กับ Facebook เสมอ',
  ],
  pinnedLinkIds: [
    'cpe-nu-page',
    'ecpe-nu-page',
    'eng-nu-page',
    'eng-academic-page',
    'eng-smo-page',
    'nu-reg',
    'nu-mail',
    'citcoms-page',
    'citcoms-services',
    'diald-page',
    'sa-page',
    'lib-page',
  ],
  categories: [
    {
      id: 'cpe-faculty',
      title: 'สาย CPE / ECPE / คณะวิศวกรรมศาสตร์',
      linkIds: [
        'cpe-nu-page',
        'ecpe-nu-page',
        'cpe-nu-activity',
        'eng-nu-page',
        'eng-academic-page',
        'eng-smo-page',
        'eng-website',
        'eng-programs-page',
        'eng-handbook-65-69',
        'cpe-curriculum-65',
        'eng-intern-system',
      ]
    },
    {
      id: 'university-systems',
      title: 'ระบบกลางของมหาวิทยาลัย',
      linkIds: [
        'nu-website',
        'nu-current-student',
        'nu-reg',
        'nu-reg-guide',
        'nu-calendar',
        'nu-academic-division',
        'nu-page',
        'nu-pr-page',
      ]
    },
    {
      id: 'it-services',
      title: 'IT / Wi-Fi / NU Mail / Software',
      linkIds: [
        'citcoms-page',
        'citcoms-services',
        'nu-mail',
        'office-365',
        'nu-change-pwd',
        'nu-ict-exam',
        'nu-training',
        'nu-online-skill',
        'nu-samart-skills',
      ]
    },
    {
      id: 'english-cept',
      title: 'สอบภาษาอังกฤษ / CEPT / เกณฑ์ Eng',
      linkIds: [
        'diald-page',
        'diald-website',
        'cept-info-post',
        'eng-req-post',
      ]
    },
    {
      id: 'student-affairs',
      title: 'กิจการนิสิต / หอพัก / ทุน / สวัสดิการ',
      linkIds: [
        'sa-page',
        'sa-website',
        'sa-year1-page',
        'dorm-post',
      ]
    },
    {
      id: 'library',
      title: 'ห้องสมุด / อ่านหนังสือ / ฐานข้อมูล',
      linkIds: [
        'lib-page',
        'lib-website',
        'lib-databases',
        'lib-vpn',
        'lib-scitech-page',
        'eng-coworking-post',
      ]
    }
  ],
  askSeniorsChecklist: [
    'กลุ่ม Facebook รุ่น CPE ปี 1',
    'กลุ่ม Line / Discord / Messenger ของรุ่น',
    'กลุ่มรายวิชา Programming / Calculus / Physics / Engineering Drawing',
    'กลุ่มแจ้งงาน Lab หรือ TA ของแต่ละวิชา',
    'กลุ่มกิจกรรมของสาขา/ภาค',
    'กลุ่มหอพักหรือกลุ่มตามหาของในมหาวิทยาลัย',
  ],
  notes: [
    'เอกสารหลักสูตร CPE ที่แนบไว้เป็นหลักสูตรปรับปรุง พ.ศ. 2565 ซึ่งเหมาะกับนิสิตรุ่นที่ใช้หลักสูตรนี้'
  ]
};
