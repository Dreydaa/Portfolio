import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Archi.css";
import gsap from "gsap";

// Gallery item component with its own details
const GalleryItem = ({ item, index }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Refs for animation elements
    const separation0Ref = useRef(null);
    const separation1Ref = useRef(null);
    const videoRef = useRef(null);
    const text1Ref = useRef(null);
    const photo1Ref = useRef(null);
    const text2Ref = useRef(null);
    const photo2Ref = useRef(null);
    const text3Ref = useRef(null);
    const photo3Ref = useRef(null);
    const detailsContainerRef = useRef(null);

    // Opening animation sequence
    const openArt = () => {
        setIsOpen(true);
    };

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            // If details are open, adjust their position based on screen size
            if (isOpen && detailsContainerRef.current) {
                // Any additional responsive adjustments if needed
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen]);

    // Animation setup after component mounts/updates
    useEffect(() => {
        if (isOpen) {
            // Initial states (before animation)
            gsap.set(separation0Ref.current, { x: "-100%" });
            gsap.set(separation1Ref.current, { x: "100%" });

            // Set content elements to half their size
            const contentElements = [
                videoRef.current,
                text1Ref.current,
                photo1Ref.current,
                text2Ref.current,
                photo2Ref.current,
                text3Ref.current,
                photo3Ref.current
            ];

            gsap.set(contentElements, { scale: 0.5, opacity: 0 });

            // Timeline for sequenced animations
            const tl = gsap.timeline();

            // Step 1: Animate separations sliding in
            tl.to(separation0Ref.current, {
                x: "0%",
                duration: 0.8,
                ease: "power2.out"
            }, 0);

            tl.to(separation1Ref.current, {
                x: "0%",
                duration: 0.8,
                ease: "power2.out"
            }, 0);

            // Step 2: Animate content elements growing and fading in
            tl.to(videoRef.current, {
                scale: 1,
                opacity: 1,
                duration: 0.6,
                ease: "back.out(1.7)"
            }, 0.6);

            // Text and photos with different speeds
            tl.to([text1Ref.current, text2Ref.current, text3Ref.current], {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: "back.out(1.4)"
            }, 0.7);

            tl.to([photo1Ref.current, photo2Ref.current, photo3Ref.current], {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                stagger: 0.15,
                ease: "back.out(1.4)"
            }, 0.8);
        }
    }, [isOpen]);

    // Close animation and state update
    const closeArt = () => {
        const tl = gsap.timeline({
            onComplete: () => setIsOpen(false)
        });

        // Animate content elements scaling down and fading out
        tl.to([
            videoRef.current,
            text1Ref.current,
            photo1Ref.current,
            text2Ref.current,
            photo2Ref.current,
            text3Ref.current,
            photo3Ref.current
        ], {
            scale: 0.5,
            opacity: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power1.in"
        }, 0);

        // Animate separations sliding out
        tl.to(separation0Ref.current, {
            x: "-100%",
            duration: 0.75,
            ease: "power2.in"
        }, 0.3);

        tl.to(separation1Ref.current, {
            x: "100%",
            duration: 0.75,
            ease: "power2.in"
        }, 0.3);
    };

    const videoElementRef = useRef(null);
    const [videoLoaded, setVideoLoaded] = useState(false);

    useEffect(() => {
        // Only handle video loading when the item is open and there's video content
        if (isOpen && item.videoContent && videoElementRef.current) {
            // Reset loaded state when opening
            setVideoLoaded(false);

            // Start loading the video
            const videoElement = videoElementRef.current;
            videoElement.load();

            // Set up event listeners
            const handleLoaded = () => setVideoLoaded(true);
            videoElement.addEventListener('loadeddata', handleLoaded);

            return () => {
                videoElement.removeEventListener('loadeddata', handleLoaded);
            };
        }
    }, [isOpen, item.videoContent]);

    return (
        <>
            <div className="gallery_container">
                <div className="gallery-items">
                    <div id={`art-${index}`} className="art" onClick={openArt} style={{ backgroundImage: `url(${item.photo})`, backgroundSize: "cover", color: "transparent" }}>{item.photo}
                        <div className="art-title">{item.title}</div>
                        <div className="art-descriptionContainer">
                            <div className="art-description">{item.Date}</div>
                            <div className="art-description">{item.Time}</div>
                        </div>
                        <div className="art-description1">{item.description}</div>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="separation_container" ref={detailsContainerRef}>
                    <div className="separation-0" ref={separation0Ref}></div>
                    <div className="separation-1" ref={separation1Ref}></div>
                    <div className="art_details">
                        <button className="close-button" onClick={closeArt}>Close</button>
                        <div className={`video-load ${!videoLoaded && isOpen ? 'loading' : ''}`} ref={videoRef}>
                            {isOpen && item.videoContent && (
                                <video
                                    ref={videoElementRef}
                                    src={item.videoContent}
                                    loop
                                    autoPlay
                                    muted
                                    playsInline
                                    controls={false}
                                    onContextMenu={e => e.preventDefault()}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        pointerEvents: "none"
                                    }}
                                />
                            )}
                        </div>
                        <div className="text-1" ref={text1Ref}>{item.text1}</div>
                        <div className="photo-1" ref={photo1Ref} style={{ backgroundImage: `url(${item.photo1})`, backgroundSize: "cover", color: "transparent" }}></div>
                        <div className="text-2" ref={text2Ref}>{item.text2}</div>
                        <div className="photo-2" ref={photo2Ref} style={{ backgroundImage: `url(${item.photo2})`, backgroundSize: "cover", color: "transparent" }}></div>
                        <div className="text-3" ref={text3Ref}>{item.text3}</div>
                        <div className="photo-3" ref={photo3Ref} style={{ backgroundImage: `url(${item.photo3})`, backgroundSize: "cover", color: "transparent" }}></div>
                    </div>
                </div>
            )}
        </>
    );
};

export default function Archi() {
    const navigate = useNavigate();
    const pageContainerRef = useRef(null);
    const transitionOverlayRef = useRef(null);
    const galleryItemsContainerRef = useRef(null);
    const navButtonsRef = useRef(null);

    // Sample gallery items data - you can expand this array with your actual data
    const galleryItems = [
        {
            photo: "https://zupimages.net/up/25/15/9zz5.png",
            title: "Dream Penthouse",
            description: "First project in 3D with Blender.",
            Date: "April 7 2025",
            Time: "60 hrs project",
            videoContent: "/F40.mp4",
            text1: "The element in this project was handmade for 90% of it",
            photo1: "https://zupimages.net/up/25/16/n58q.png",
            text2: "The inspiration come from some existing apartments in New York who merge old times and extra luxury",
            photo2: "https://zupimages.net/up/25/16/94pb.png",
            text3: "This project is a mix of work, in this one I learning many things like: Rendering, lighting, Modeling and some other things",
            photo3: "https://zupimages.net/up/25/16/0cy3.png"
        },
        
        // Add more gallery items as needed
    ];
    
    const [isMobile, setIsMobile] = useState(false);
    
    // Check screen size on mount and resize
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkScreenSize(); // Check initially
        window.addEventListener('resize', checkScreenSize);
        
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

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
            overlayElement.style.backgroundColor = '#F5F5F5'; // Using same color as in App.css
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

        // Animate gallery items entering from bottom
        tl.to('.gallery_container', {
            y: '0',
            stagger: 0.1,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.8');

        // Animate nav buttons fading in
        tl.to('.containergalley', {
            y: '0',
            opacity: 1,
            stagger: 0.05,
            duration: 0.6,
            ease: 'back.out(1.7)'
        }, '-=0.8');

        // Animate nav buttons fading in
        tl.to('.galley button', {
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

    // Navigation transition effect
    const handleNavigation = (destination) => {
        // Create a new overlay for exit transition if needed
        if (!transitionOverlayRef.current) {
            const overlayElement = document.createElement('div');
            overlayElement.className = 'page-transition-overlay';
            overlayElement.style.position = 'fixed';
            overlayElement.style.top = '0';
            overlayElement.style.left = '0';
            overlayElement.style.width = '100%';
            overlayElement.style.height = '100%';
            overlayElement.style.backgroundColor = 'red';
            overlayElement.style.zIndex = '1000';
            overlayElement.style.transform = 'translateY(-100%)';
            document.body.appendChild(overlayElement);
            transitionOverlayRef.current = overlayElement;
        }

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
            y: '0%',
            duration: 1,
            opacity: 0,
            ease: 'power2.inOut'
        });

        // Animate gallery items out
        tl.to('.gallery_container', {
            y: '100vh',
            stagger: 0.1,
            duration: 0.5,
            ease: 'power3.in'
        }, '-=0.6');

        // animate title galley
        tl.to('.containergalley', {
            y: '-50px',
            opacity: 0,
            stagger: 0.08,
            duration: 0.6,
            ease: 'power1.in'
        }, '-=0.8');

        // Animate nav buttons out
        tl.to('.galley button', {
            y: '-50px',
            opacity: 0,
            stagger: 0.08,
            duration: 0.6,
            ease: 'power1.in'
        }, '-=0.9');
    };

    return (
        <>
            <div className={`galley ${isMobile ? 'mobile' : ''}`} ref={navButtonsRef}>
                <div ref={pageContainerRef} className="containergalley"><h4>BLENDER PROJECT</h4></div>
                <div className="nav-buttons">
                    <button className="title" onClick={() => handleNavigation('/')}>Home</button>
                    <button className="title" onClick={() => handleNavigation('/WebDesign')}>WebDesign</button>
                </div>
            </div>

            <div ref={galleryItemsContainerRef} className="gallery-container-wrapper">
                {/* Render all gallery items dynamically */}
                {galleryItems.map((item, index) => (
                    <GalleryItem key={index} item={item} index={index} />
                ))}
            </div>
        </>
    );
}