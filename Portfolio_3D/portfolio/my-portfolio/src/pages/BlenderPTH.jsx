import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import "./../styles/BlenderPTH.css";
import { Github as GitHub, Linkedin, Github, ArrowRightCircle } from 'lucide-react';


function Blender() {
    const navigate = useNavigate();

    const transitionOverlayRef = useRef(null);

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

    // Page load animation
    useEffect(() => {
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
        <div>
            <header>
                <span className="logoAB">AB</span>
                <ul>
                    <li><a onClick={() => handleNavigation("/")}>Home</a></li>
                    <li><a onClick={() => handleNavigation("/Blender")}>Blender</a></li>
                    <li><a onClick={() => handleNavigation("/WebDesign")}>WebDesign</a></li>
                    <li><a href="#overview">Overview</a></li>
                    <li><a href="#process">Process</a></li>
                    <li><a href="#" className="logo"><Github size={24} /></a></li>
                    <li><a href="#" className="logo"><Linkedin size={24} /></a></li>
                </ul>
            </header>

            <section id="home">
                <div class="stickyContainer">
                    <h1>The Apartment</h1>
                </div>
            </section>


            <section id="overview">
                <span className="transitionBar"></span>
                <h2>Overview</h2>
                <div className="videoContainer">
                    <div className="videoPlaying">
                        <video
                            src="../../public/F40.mp4"
                            loop
                            autoPlay
                            muted
                            playsInline
                            controls={false}
                            onContextMenu={e => e.preventDefault()}
                            style={{
                                width: "39vw",
                                height: "75vh",
                                overflow: "hidden",
                                objectFit: "cover",
                                pointerEvents: "none"
                            }}
                        />
                    </div>
                    <div className="overviewText">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. At laudantium quas ut neque, vero eum perspiciatis quibusdam. Velit quaerat autem quos similique ea, quod quisquam debitis, ipsum nulla nemo odit.</p>
                    </div>
                </div>
            </section>
            <section id="process">
                <span className="transitionBar"></span>
                <h2>Process</h2>
                <div className="imageContainer">
                    <div className="overviewText">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. At laudantium quas ut neque, vero eum perspiciatis quibusdam. Velit quaerat autem quos similique ea, quod quisquam debitis, ipsum nulla nemo odit.</p>
                    </div>
                    <div className="gridImage">
                        <div className="gridImageItem gridimg1"></div>
                        <div className="gridImageItem gridimg2"></div>
                        <div className="gridImageItem gridimg3"></div>
                        <div className="gridImageItem gridimg4"></div>
                    </div>
                </div>
            </section>
            <section id="next">
                <span className="transitionBar"></span>
                <h2>Next Project</h2>

                <div className="buttonContainer">
                <button className="nextButton" onClick={() => handleNavigation("/")}>
                    <p>Next Project</p><ArrowRightCircle  className="arrow" size={24} />
                </button>
                </div>
            </section>
        </div>
    );
}

export default Blender