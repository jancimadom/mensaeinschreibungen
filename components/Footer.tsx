'use client';

import Link from 'next/link';
import React from 'react';

export const Footer = () => {
    return (
        <footer className="footer-container">
            {/* Elegant Gradient Accent Bar */}
            <div className="footer-gradient-bar" />
            
            <div className="footer-content">
                <div className="footer-flex">
                    
                    {/* Branding & Info Section */}
                    <div className="footer-branding">
                        <div className="footer-brand-row">
                            <span className="footer-brand-main">Meldung Mittagspause</span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-[9px] text-zinc-500/70 font-medium">
                            <span>© 2026 Jan Cimadom</span>
                            <span className="text-zinc-300">|</span>
                            <span>Technische Umsetzung: Jan Cimadom</span>
                        </div>
                    </div>

                    {/* Navigation Section */}
                    <nav className="flex items-center gap-6">
                        {[
                            { name: 'Impressum', href: '/impressum' },
                            { name: 'Datenschutz', href: 'https://www.sspbruneck1.it/privacy/' },
                            { name: 'Kontakt', href: '/kontakt' },
                            { name: 'Über mich', href: '/ueber-uns' }
                        ].map((link) => (
                            <Link 
                                key={link.href} 
                                href={link.href}
                                className="footer-nav-link"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    );
};
