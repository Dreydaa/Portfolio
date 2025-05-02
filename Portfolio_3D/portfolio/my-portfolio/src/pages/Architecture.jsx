import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Archi.css";
import "./../styles/mediaQuery.css";
import gsap from "gsap";
import { Github as GitHub, Linkedin, Github, Inspect, Instagram } from 'lucide-react';

// Gallery item component with its own details
const GalleryItem = () => {
    const navigate = useNavigate();

    // Refs for animation elements
    const handleNavigation = (destination) => {
        // Create a new overlay for exit transition if needed


        // Prevent scrolling during transition
        document.body.style.overflow = 'hidden';

        // Animation timeline for exit
        const tl = gsap.timeline({
            onComplete: () => {
                navigate(destination);
            }
        });

        // Animate overlay coming down
        tl.to(transitionOverlayRef.current, {
            y: '-100%',
            duration: 1.2,
            opacity: 1,
            ease: 'power2.inOut'
        });

        // Animate nav buttons out
        tl.to('header', {
            y: '-50px',
            opacity: 0,
            stagger: 0.08,
            duration: 0.6,
            ease: 'power1.in'
        }, '-=0.9');

        tl.to('h1', {
            opacity: 0,
            duration: 0.3,
            ease: 'power1.in'
        })
    };

    const transitionOverlayRef = useRef(null);

    // Page load animation
    useEffect(() => {

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
        // Create transition overlay if it doesn't exist in the DOM
        if (!document.querySelector('.page-transition-overlay')) {
            const overlayElement = document.createElement('div');
            overlayElement.className = 'page-transition-overlay';
            overlayElement.style.position = 'fixed';
            overlayElement.style.top = '0';
            overlayElement.style.left = '0';
            overlayElement.style.width = '100%';
            overlayElement.style.height = '100%';
            overlayElement.style.backgroundColor = '#F8F4F1'; // Using same color as in App.css
            overlayElement.style.zIndex = '1000';
            document.body.appendChild(overlayElement);
            transitionOverlayRef.current = overlayElement;
        } else {
            transitionOverlayRef.current = document.querySelector('.page-transition-overlay');
        }

        // Add class to body to prevent scrolling during animation
        document.body.style.overflow = 'hidden';

        // Initial setup for page elements
        gsap.set('.gallery_container', { y: '100vh' }); // Set gallery items below screen
        gsap.set('.galley button', { y: '-50px', opacity: 0 }); // Set nav buttons above
        gsap.set('.containergalley', { y: '-50px', opacity: 0 }); // Set nav buttons above

        // Create animation timeline
        const tl = gsap.timeline({
            onComplete: () => {
                // Re-enable scrolling after animation
                document.body.style.overflow = '';

                // Remove overlay when done
                if (transitionOverlayRef.current) {
                    transitionOverlayRef.current.style.pointerEvents = 'none';
                    gsap.to(transitionOverlayRef.current, {
                        opacity: 0,
                        duration: 0.3,
                        onComplete: () => {
                            if (transitionOverlayRef.current && transitionOverlayRef.current.parentNode) {
                                transitionOverlayRef.current.parentNode.removeChild(transitionOverlayRef.current);
                            }
                        }
                    });
                }
            }
        });

        // Animate the transition overlay
        tl.to(transitionOverlayRef.current, {
            y: '-100%',
            duration: 1.2,
            ease: 'power2.inOut'
        });

        // Animate nav buttons fading in
        tl.to('header', {
            y: '0',
            opacity: 1,
            stagger: 0.05,
            duration: 0.6,
            ease: 'back.out(1.7)'
        }, '-=0.8');

        // Cleanup function
        return () => {
            if (transitionOverlayRef.current && transitionOverlayRef.current.parentNode) {
                transitionOverlayRef.current.parentNode.removeChild(transitionOverlayRef.current);
            }
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <>
            <header>
                <span className="logoAB" onClick={() => handleNavigation("/")}>AB</span>
                <ul className="nav">
                    <li><a onClick={() => handleNavigation("/")}>Home</a></li>
                    <li><a onClick={() => handleNavigation("/WebDesign")}>WebDesign</a></li>
                    <li><a href="#projects">Project</a></li>
                    <li><a href="https://www.instagram.com/alan.dyd/" target="_blank" className="logo"><Instagram size={24} color="white"/></a></li>
                    <li><a href="https://www.linkedin.com/in/alan-bultel/" target="_blank" className="logo"><Linkedin size={24} color="white"/></a></li>
                </ul>
            </header>

            <section id="home">
                <div className="stickyContainer">
                    <h1>Blender</h1>
                </div>
            </section>

            <section id="projects">
                <span className="transitionBar"></span>
                    <h2>Projects</h2>

                    <div className="listContainer">
                        <div className="gridProjects">
                            <div onClick={() => navigate("/DreamPenthouse")} className="gridStatut gridG1">
                            </div>
                            {/* <div className="gridStatut grid2"></div>
                            <div className="gridStatut grid3"></div>
                            <div className="gridStatut grid4"></div>
                            <div className="gridStatut grid5"></div>
                            <div className="gridStatut grid6"></div>
                            <div className="gridStatut grid7"></div>
                            <div className="gridStatut grid8"></div>
                            <div className="gridStatut grid9"></div>
                            <div className="gridStatut grid10"></div>
                            <div className="gridStatut grid11"></div>
                            <div className="gridStatut grid12"></div> */}
                        </div>
                    </div>
            </section>
    </>
    );
};

export default GalleryItem;