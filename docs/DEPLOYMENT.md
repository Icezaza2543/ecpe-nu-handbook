# Deployment Guide

คู่มือนี้จะอธิบายขั้นตอนการนำโปรเจกต์ **ECPE NU Freshman Handbook V2** ขึ้น production โดยเฉพาะบน **GitHub Pages**

## การเตรียมตัวและตรวจสอบความพร้อมก่อน Deploy

เพื่อให้แน่ใจว่าแอปพลิเคชันพร้อมสำหรับ production ให้รันขั้นตอนการตรวจสอบเหล่านี้ในเครื่องของคุณก่อน:

```bash
# 1. ติดตั้ง Dependencies ให้ครบถ้วน
npm install

# 2. ตรวจสอบโค้ดและรูปแบบ (Linting)
npm run lint

# 3. รัน Unit Tests เพื่อทดสอบความถูกต้องของข้อมูล (SSOT / Validation)
npm run test

# 4. ทดสอบ Build เพื่อดูว่าสามารถคอมไพล์ผ่านและไม่มีข้อผิดพลาด
npm run build
```

## GitHub Pages Deployment

### 1. การตั้งค่า Base Path ใน `vite.config.ts`

หากคุณจะโฮสต์โปรเจกต์นี้ใน Subpath (เช่น `https://username.github.io/repo-name/`) คุณจะต้องแก้ไขไฟล์ `vite.config.ts` ให้ระบุ `base` ให้ตรงกับชื่อ repository:

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // ตัวอย่าง: ถ้า repo ชื่อ cpehb ให้แก้เป็น base: '/cpehb/'
  base: '/cpehb/',
})
```
*หมายเหตุ: หากโฮสต์ไว้ที่ root path หรือ custom domain (เช่น `cpehb.app`) ให้ลบ `base` ออกหรือตั้งเป็น `'/'`*

### 2. การจัดการ React Router (404 Issue)

โปรเจกต์นี้ใช้ `BrowserRouter` ซึ่งเมื่อผู้ใช้กด Refresh ที่หน้าอื่นๆ ที่ไม่ใช่หน้าแรก GitHub Pages จะตอบกลับด้วยหน้า 404 เนื่องจากไม่มีไฟล์ HTML ตามพาร์ทนั้นจริง
วิธีแก้ปัญหาคือการทำสำเนา `index.html` ไปเป็น `404.html` ในโฟลเดอร์ `public/` (หรือ `dist/` ตอน build) เพื่อให้ GitHub Pages redirect ทุก URL กลับมาที่ไฟล์เดียวกัน

### 3. Deploy ผ่าน GitHub Actions (Automated CI/CD)

วิธีที่ง่ายและปลอดภัยที่สุดคือการใช้ GitHub Actions ในการสั่ง build และ deploy ไฟล์ใน `dist/` ขึ้น GitHub Pages อัตโนมัติ

สร้างไฟล์ที่ `.github/workflows/deploy.yml` ด้วยเนื้อหาดังนี้:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main # หรือ master
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: react-vite/package-lock.json
      - name: Install dependencies
        working-directory: ./react-vite
        run: npm ci
      - name: Lint and Test
        working-directory: ./react-vite
        run: |
          npm run lint
          npm run test
      - name: Build
        working-directory: ./react-vite
        run: npm run build
      - name: Fix GitHub Pages 404
        working-directory: ./react-vite
        run: cp dist/index.html dist/404.html
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./react-vite/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

> **ข้อควรระวัง:** ก่อนใช้งาน Action นี้ ให้เข้าไปที่ Settings ของ Repository -> Pages -> ตรงเมนู "Build and deployment" ให้เปลี่ยน "Source" เป็น **GitHub Actions**
