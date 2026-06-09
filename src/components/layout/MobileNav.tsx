import { NavLink } from 'react-router-dom';

const links = [
  ['/', 'Home'],
  ['/visual-maps', 'Maps'],
  ['/courses', 'Courses'],
  ['/roadmaps', 'Roadmaps'],
];

export function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="มือถือ">
      {links.map(([path, label]) => (
        <NavLink key={path} to={path} end={path === '/'}>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
