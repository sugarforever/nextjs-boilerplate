'use client';

import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();

  // Hide footer on chat page
  if (pathname === '/chat') {
    return null;
  }

  return (
    <footer className="bg-white text-black py-4">
      <div className="container mx-auto flex justify-center items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;
