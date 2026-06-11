import {
  BookOpen,
  Compass,
  HelpCircle,
  Home,
  Map,
  Network,
  Route,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = {
  path: string;
  label: string;
  icon: LucideIcon;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: 'EXPLORE',
    items: [{ path: '/', label: 'หน้าแรก', icon: Home }],
  },
  {
    label: 'CURRICULUM',
    items: [
      { path: '/visual-maps', label: 'แผนภาพรวมหลักสูตร', icon: Map },
      { path: '/courses', label: 'รายวิชาทั้งหมด', icon: BookOpen },
      { path: '/dependency-graph', label: 'วิชาตัวต่อ', icon: Network },
      { path: '/roadmaps', label: 'Roadmap อาชีพ', icon: Route },
    ],
  },
  {
    label: 'RESOURCES',
    items: [
      { path: '/tools-sources', label: 'สิ่งที่มหาลัยไม่ได้สอน', icon: Compass },
      { path: '/survival-guide', label: 'คู่มือเอาตัวรอด', icon: Sparkles },
      { path: '/faq', label: 'FAQ', icon: HelpCircle },
      { path: '/senior-tips', label: 'คำแนะนำจากรุ่นพี่', icon: Users },
    ],
  },
];

export const primaryMobileLinks: NavItem[] = [
  { path: '/', label: 'หน้าแรก', icon: Home },
  { path: '/courses', label: 'รายวิชา', icon: BookOpen },
  { path: '/visual-maps', label: 'แผนภาพ', icon: Map },
  { path: '/roadmaps', label: 'อาชีพ', icon: Route },
];
