'use client';

import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();

  if (pathname === '/chat') {
    return null;
  }

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-5xl px-6 py-6">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
