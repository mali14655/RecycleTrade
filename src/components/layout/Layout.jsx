// components/layout/Layout.jsx - UPDATED
import React from 'react';
import Navbar from '../Navbar'; // Now using new Navbar
import Footer from '../Footer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}