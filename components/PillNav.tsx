"use client";
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ntr } from '@/lib/fonts';

export type PillNavItem = {
    label: string;
    href: string;
    ariaLabel?: string;
    external?: boolean; // opens in a new tab (e.g. resume PDF)
};

export type PillNavSocial = {
    label: string;
    href: string;
    external: boolean;
    icon: React.ReactNode;
};

export interface PillNavProps {
    items: PillNavItem[];
    activeHref?: string;
    /** shown as an icon row inside the mobile dropdown */
    socials?: PillNavSocial[];
    /** rendered inside the rounded bar, before the pills (e.g. the site owner's name) */
    logo?: React.ReactNode;
    className?: string;
    ease?: string;
    baseColor?: string;
    pillColor?: string;
    hoveredPillTextColor?: string;
    pillTextColor?: string;
    onMobileMenuClick?: () => void;
    initialLoadAnimation?: boolean;
}

const PillNav: React.FC<PillNavProps> = ({
    items,
    activeHref,
    socials = [],
    logo,
    className = '',
    ease = 'power3.easeOut',
    baseColor = '#fff',
    pillColor = '#060010',
    hoveredPillTextColor = '#060010',
    pillTextColor,
    onMobileMenuClick,
    initialLoadAnimation = true
}) => {
    const resolvedPillTextColor = pillTextColor ?? baseColor;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
    const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);
    const hamburgerRef = useRef<HTMLButtonElement | null>(null);
    const mobileMenuRef = useRef<HTMLDivElement | null>(null);
    const navItemsRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const layout = () => {
            circleRefs.current.forEach(circle => {
                if (!circle?.parentElement) return;

                const pill = circle.parentElement as HTMLElement;
                const rect = pill.getBoundingClientRect();
                const { width: w, height: h } = rect;
                const R = ((w * w) / 4 + h * h) / (2 * h);
                const D = Math.ceil(2 * R) + 2;
                const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
                const originY = D - delta;

                circle.style.width = `${D}px`;
                circle.style.height = `${D}px`;
                circle.style.bottom = `-${delta}px`;

                gsap.set(circle, {
                    xPercent: -50,
                    scale: 0,
                    transformOrigin: `50% ${originY}px`
                });

                const label = pill.querySelector<HTMLElement>('.pill-label');
                const white = pill.querySelector<HTMLElement>('.pill-label-hover');

                if (label) gsap.set(label, { y: 0 });
                if (white) gsap.set(white, { y: h + 12, opacity: 0 });

                const index = circleRefs.current.indexOf(circle);
                if (index === -1) return;

                tlRefs.current[index]?.kill();
                const tl = gsap.timeline({ paused: true });

                tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

                if (label) {
                    tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
                }

                if (white) {
                    gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
                    tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
                }

                tlRefs.current[index] = tl;
            });
        };

        layout();

        const onResize = () => layout();
        window.addEventListener('resize', onResize);

        if (typeof document !== 'undefined' && document.fonts) {
            document.fonts.ready.then(layout).catch(() => { });
        }

        const menu = mobileMenuRef.current;
        if (menu) {
            gsap.set(menu, { visibility: 'hidden', opacity: 0, scaleY: 1, y: 0 });
        }

        if (initialLoadAnimation) {
            const navItems = navItemsRef.current;

            if (navItems) {
                gsap.set(navItems, { width: 0, overflow: 'hidden' });
                gsap.to(navItems, {
                    width: 'auto',
                    duration: 0.6,
                    ease
                });
            }
        }

        return () => window.removeEventListener('resize', onResize);
    }, [items, ease, initialLoadAnimation]);

    const handleEnter = (i: number) => {
        const tl = tlRefs.current[i];
        if (!tl) return;
        activeTweenRefs.current[i]?.kill();
        activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
            duration: 0.3,
            ease,
            overwrite: 'auto'
        });
    };

    const handleLeave = (i: number) => {
        const tl = tlRefs.current[i];
        if (!tl) return;
        activeTweenRefs.current[i]?.kill();
        activeTweenRefs.current[i] = tl.tweenTo(0, {
            duration: 0.2,
            ease,
            overwrite: 'auto'
        });
    };

    const toggleMobileMenu = () => {
        const newState = !isMobileMenuOpen;
        setIsMobileMenuOpen(newState);

        const hamburger = hamburgerRef.current;
        const menu = mobileMenuRef.current;

        if (hamburger) {
            const lines = hamburger.querySelectorAll('.hamburger-line');
            if (newState) {
                gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
                gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
            } else {
                gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
                gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
            }
        }

        if (menu) {
            if (newState) {
                gsap.set(menu, { visibility: 'visible' });
                gsap.fromTo(
                    menu,
                    { opacity: 0, y: 10, scaleY: 1 },
                    {
                        opacity: 1,
                        y: 0,
                        scaleY: 1,
                        duration: 0.3,
                        ease,
                        transformOrigin: 'top center'
                    }
                );
            } else {
                gsap.to(menu, {
                    opacity: 0,
                    y: 10,
                    scaleY: 1,
                    duration: 0.2,
                    ease,
                    transformOrigin: 'top center',
                    onComplete: () => {
                        gsap.set(menu, { visibility: 'hidden' });
                    }
                });
            }
        }

        onMobileMenuClick?.();
    };

    // close the mobile menu when tapping anywhere outside it
    useEffect(() => {
        if (!isMobileMenuOpen) return;
        const onPointerDown = (e: PointerEvent) => {
            const target = e.target as Node;
            if (mobileMenuRef.current?.contains(target)) return;
            if (hamburgerRef.current?.contains(target)) return;
            toggleMobileMenu();
        };
        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobileMenuOpen]);

    const cssVars = {
        ['--base']: baseColor,
        ['--pill-bg']: pillColor,
        ['--hover-text']: hoveredPillTextColor,
        ['--pill-text']: resolvedPillTextColor,
        ['--nav-h']: '36px',
        ['--pill-pad-x']: '14px',
        ['--pill-gap']: '3px'
    } as React.CSSProperties;

    return (
        <div className="relative">
            <nav
                className={`flex items-center justify-start ${className}`}
                aria-label="Primary"
                style={cssVars}
            >
                {/* Desktop Nav */}
                <div
                    ref={navItemsRef}
                    className="relative items-center rounded-full hidden md:flex"
                    style={{
                        height: 'var(--nav-h)',
                        background: 'var(--base, #000)'
                    }}
                >
                    {logo && (
                        <div className="flex items-center pl-4 pr-4">{logo}</div>
                    )}
                    <ul
                        role="menubar"
                        className="list-none flex items-stretch m-0 p-[3px] h-full"
                        style={{ gap: 'var(--pill-gap)' }}
                    >
                        {items.map((item, i) => {
                            const isActive = activeHref === item.href;

                            const pillStyle: React.CSSProperties = {
                                background: 'var(--pill-bg, #fff)',
                                color: 'var(--pill-text, var(--base, #000))',
                                paddingLeft: 'var(--pill-pad-x)',
                                paddingRight: 'var(--pill-pad-x)'
                            };

                            const PillContent = (
                                <>
                                    <span
                                        className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                                        style={{
                                            background: 'var(--base, #000)',
                                            willChange: 'transform'
                                        }}
                                        aria-hidden="true"
                                        ref={el => {
                                            circleRefs.current[i] = el;
                                        }}
                                    />
                                    <span className="label-stack relative inline-block leading-[1] z-[2]">
                                        <span
                                            className="pill-label relative z-[2] inline-block leading-[1]"
                                            style={{ willChange: 'transform' }}
                                        >
                                            {item.label}
                                        </span>
                                        <span
                                            className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
                                            style={{
                                                color: 'var(--hover-text, #fff)',
                                                opacity: isActive ? 1 : 0,
                                                transform: isActive ? 'none' : undefined,
                                                willChange: 'transform, opacity'
                                            }}
                                            aria-hidden="true"
                                        >
                                            {item.label}
                                        </span>
                                    </span>
                                    {/* Removed dot indicator */}
                                </>
                            );

                            const basePillClasses =
                                `${ntr.className} relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-semibold text-[14px] leading-[0] uppercase tracking-[0.2px] whitespace-nowrap cursor-pointer px-0`;

                            return (
                                <li key={item.href} role="none" className="flex h-full">
                                    <a
                                        role="menuitem"
                                        href={item.href}
                                        target={item.external ? '_blank' : undefined}
                                        rel={item.external ? 'noreferrer' : undefined}
                                        className={basePillClasses}
                                        style={pillStyle}
                                        aria-label={item.ariaLabel || item.label}
                                        onMouseEnter={() => handleEnter(i)}
                                        onMouseLeave={() => handleLeave(i)}
                                    >
                                        {PillContent}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Mobile Hamburger */}
                <button
                    ref={hamburgerRef}
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                    aria-expanded={isMobileMenuOpen}
                    className="md:hidden rounded-full border border-white/15 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-1 cursor-pointer p-0 relative"
                    style={{
                        width: 'var(--nav-h)',
                        height: 'var(--nav-h)'
                    }}
                >
                    <span
                        className="hamburger-line w-4 h-0.5 rounded origin-center transition-all duration-[10ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                        style={{ background: 'rgba(232, 232, 238, 0.9)' }}
                    />
                    <span
                        className="hamburger-line w-4 h-0.5 rounded origin-center transition-all duration-[10ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                        style={{ background: 'rgba(232, 232, 238, 0.9)' }}
                    />
                </button>
            </nav>

            {/* Mobile Menu Dropdown */}
            <div
                ref={mobileMenuRef}
                className="md:hidden absolute top-14 left-0 rounded-[27px] border border-[#26262f] shadow-[0_12px_40px_rgba(0,0,0,0.6)] z-[998] origin-top min-w-[180px] overflow-hidden"
                style={{
                    ...cssVars,
                    background: 'rgba(16, 16, 22, 0.92)',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)'
                }}
            >
                <ul className="list-none m-0 p-[6px] flex flex-col gap-[2px]">
                    {items.map(item => {
                        const linkClasses =
                            'block py-3 px-4 text-[14px] font-medium rounded-[50px] transition-colors duration-200 active:bg-white/10';

                        return (
                            <li key={item.href}>
                                <a
                                    href={item.href}
                                    target={item.external ? '_blank' : undefined}
                                    rel={item.external ? 'noreferrer' : undefined}
                                    className={linkClasses}
                                    style={{ color: 'rgba(232, 232, 238, 0.9)' }}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </a>
                            </li>
                        );
                    })}
                </ul>
                {socials.length > 0 && (
                    <>
                        <div className="mx-3 h-px bg-[#26262f]" aria-hidden />
                        <div className="flex items-center gap-1 p-[6px]">
                            {socials.map(social => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    target={social.external ? '_blank' : undefined}
                                    rel={social.external ? 'noreferrer' : undefined}
                                    className="flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 active:bg-white/10"
                                    style={{ color: 'rgba(232, 232, 238, 0.75)' }}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PillNav;
