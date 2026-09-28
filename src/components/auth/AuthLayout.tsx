import React from "react";
import "../../assets/css/auth.css";

export interface AuthQuote {
    text: string;
    author: string;
}

interface AuthLayoutProps {
    title: string;
    subtitle?: string;
    quote: AuthQuote;
    /** Which side the form sits on. Defaults to the left. */
    formSide?: "left" | "right";
    children: React.ReactNode;
}

/**
 * Split-screen shell for the auth flows: the form on one half, a decorative
 * gradient / grid-line panel with an inspirational quote on the other. The
 * panel collapses on small screens, leaving just the form.
 */
const AuthLayout: React.FC<AuthLayoutProps> = ({
    title,
    subtitle,
    quote,
    formSide = "left",
    children,
}) => {
    return (
        <div className={`kf-auth${formSide === "right" ? " kf-auth--reverse" : ""}`}>
            <div className="kf-auth__form-side">
                <div className="kf-auth__form-wrap">
                    <div className="kf-auth__brand-mark">
                        Kaf<span>up</span>
                    </div>
                    <h1 className="kf-auth__title">{title}</h1>
                    {subtitle && <p className="kf-auth__subtitle">{subtitle}</p>}
                    {children}
                </div>
            </div>

            <aside className="kf-auth__panel">
                <div className="kf-auth__panel-content">
                    <div className="kf-auth__panel-brand">
                        Kaf<span>up</span>
                    </div>
                </div>
                <blockquote className="kf-auth__quote">
                    <div className="kf-auth__quote-mark">&ldquo;</div>
                    <p className="kf-auth__quote-text">{quote.text}</p>
                    <footer className="kf-auth__quote-author">— {quote.author}</footer>
                </blockquote>
            </aside>
        </div>
    );
};

export default AuthLayout;
