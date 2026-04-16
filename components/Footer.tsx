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
                        <div className="footer-info-row">
                            <span>© 2026 Jan Cimadom</span>
                            <span style={{ color: '#d4d4d8' }}>|</span>
                            <span>Technische Umsetzung: Jan Cimadom</span>
                        </div>
                    </div>

                    {/* Navigation Section */}
                    <nav className="footer-nav">
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
