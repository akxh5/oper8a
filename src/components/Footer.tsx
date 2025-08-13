

import React from 'react';

const Footer = () => {
  return (
    <footer className="glass-panel border-t border-white/10 mt-8">
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-300">
        <span>© {new Date().getFullYear()} Oper8a. All rights reserved.</span>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="/contact" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;