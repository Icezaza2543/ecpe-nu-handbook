# ECPE NU Freshman Handbook

คู่มือไม่เป็นทางการสำหรับนิสิตวิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยนเรศวร

โปรเจกต์นี้รวมข้อมูลหลักสูตร แผนการเรียน วิชาบังคับก่อน สายอาชีพ เครื่องมือ แหล่งเรียนรู้ FAQ และคำแนะนำจากรุ่นพี่ไว้ในเว็บเดียว โดยออกแบบให้เป็น Handbook ที่อ่านง่าย ใช้งานจริงได้ และเหมาะกับนิสิตปี 1 ที่ต้องเริ่มวางแผน 4 ปีตั้งแต่เนิ่น ๆ

## Features

- Visual Maps สำหรับดูแผน 4 ปี วิชาตัวต่อ workload GenEd และเงื่อนไขก่อนจบ
- Course Catalog ที่ค้นหา กรอง และเปิดรายละเอียดรายวิชาได้
- Dependency Graph สำหรับสำรวจ prerequisite และผลกระทบของวิชาตัวต่อ
- Career Roadmaps แบบ skill tree พร้อมรายวิชา เครื่องมือ และไอเดีย portfolio
- Tools & Sources รวมเครื่องมือ แหล่งเรียนรู้ และ skill gap นอกห้องเรียน
- Survival Guide, FAQ, Senior Tips และ Credits
- Route aliases และ fallback สำหรับ path ที่พิมพ์ผิดหรือ path เก่าจาก `/ecpe-nu-handbook/...`

## Tech Stack

| Area | Stack |
| --- | --- |
| UI | React 19, TypeScript |
| Build | Vite 8 |
| Routing | React Router 7 |
| Styling | Custom CSS |
| Icons | lucide-react |
| Motion | framer-motion |
| Graphs | @xyflow/react, custom 2D canvas |
| Search | fuse.js |
| Validation | zod, Vitest |
| Deploy target | Vercel-ready SPA |

## Local Development

```bash
npm install
npm run dev
```

เปิดเว็บที่ Vite แสดงใน terminal โดยปกติคือ:

```text
http://localhost:5173
```

## Validation

ก่อนส่งงานหรือ deploy ควรรัน:

```bash
npm run lint
npm run test
npm run build
```

สถานะล่าสุด:

- `npm run lint` ผ่าน
- `npm run test` ผ่าน
- `npm run build` ผ่าน
- Vite ยังเตือนเรื่อง initial chunk เกิน 500 kB ซึ่งเป็น performance warning ไม่ใช่ build failure

## Deployment

โปรเจกต์พร้อม deploy บน Vercel จาก root repo:

- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrite อยู่ใน `vercel.json`
- Default base path คือ `/`

ถ้าต้อง deploy บน subpath เช่น GitHub Pages ให้กำหนด env:

```bash
VITE_BASE_PATH=/ecpe-nu-handbook/
```

## Project Notes For AI Agents

AI/agent context ถูกรวมไว้ที่ไฟล์เดียว:

```text
AGENTS.md
```

ไฟล์นี้เป็น source of truth สำหรับ design direction, routing, deployment, dependency rationale, page contracts และ QA checklist ของโปรเจกต์

## Contributing

โปรเจกต์นี้เป็น unofficial handbook สำหรับช่วยนิสิต ECPE NU หากต้องการช่วยปรับปรุง สามารถเปิด issue หรือส่ง pull request ได้ โดยควรรัน validation commands ก่อนส่งงานทุกครั้ง
