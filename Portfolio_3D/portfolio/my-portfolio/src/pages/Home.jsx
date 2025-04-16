import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import "../styles/fdd.scss";
import "../components/App";
import LocomotiveScroll from "locomotive-scroll";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

function previewBeVisible(previewClass) {
  const preview = document.querySelector(`.${previewClass}`);
  if (preview) {
    // Use GSAP for smooth animation
    gsap.to(preview, {
      opacity: 1,
      x: 0,
      duration: 0.4,
      ease: "power2.out"
    });
  }
}

function previewDontBeVisible(previewClass) {
  const preview = document.querySelector(`.${previewClass}`);
  if (preview) {
    // Use GSAP for smooth animation out
    gsap.to(preview, {
      opacity: 0,
      x: 30,
      duration: 0.4,
      ease: "power2.in"
    });
  }
}

// Architecture Grid Animation function
const animateArchitectureGrid = () => {
  // Initial state - all grid items have 0 scale
  gsap.set([
    ".grid-Archi", 
    ".grid-Archi1", 
    ".grid-Archi2", 
    ".grid-Archi3",
    ".grid-Archi4", 
    ".grid-Archi5", 
    ".grid-Archi6"
  ], {
    scaleX: 0,
    scaleY: 0,
    transformOrigin: "left top",
    opacity: 0
  });

  // Create the animation timeline
  const gridTimeline = gsap.timeline({
    defaults: {
      ease: "power3.out"
    }
  });

  // Step 1: Stretch grid-Archi from left to right
  gridTimeline.to(".grid-Archi", {
    scaleX: 1,
    scaleY: 1,  
    opacity: 1,
    duration: 0.8,
    transformOrigin: "left center",
  });

  // Step 2: Stretch grid-Archi 1, 3, 2 from top to bottom in cascade
  gridTimeline.to(".grid-Archi3", {
      scaleY: 1,
      scaleX: 1,
      opacity: 1,
      duration: 0.6,
      transformOrigin: "center top",
    }, "-=0.3")
    .to(".grid-Archi1", {
      scaleY: 1,
      scaleX: 1,
      opacity: 1,
      duration: 0.6,
      transformOrigin: "center top",
    }, "-=0.3")
    .to(".grid-Archi2", {
      scaleY: 1,
      scaleX: 1,
      opacity: 1,
      duration: 0.6,
      transformOrigin: "center top",
    }, "-=0.3");

  // Step 3: Stretch grid-Archi 4, 6, 5 from bottom to top in reverse cascade
  gridTimeline
    .to(".grid-Archi4", {
      scaleY: 1,
      scaleX: 1,
      opacity: 1,
      duration: 0.6,
      transformOrigin: "center bottom",
    }, "-=0.2")
    .to(".grid-Archi6", {
      scaleY: 1,
      scaleX: 1,
      opacity: 1,
      duration: 0.6,
      transformOrigin: "center bottom",
    }, "-=0.3")
    .to(".grid-Archi5", {
      scaleY: 1,
      scaleX: 1,
      opacity: 1,
      duration: 0.6,
      transformOrigin: "center bottom",
    }, "-=0.3");

  return gridTimeline;
};

// Integration of ScrollTrigger with Locomotive Scroll
const initScrollTriggerWithLocomotive = (scrollContainer, locomotiveInstance) => {
  // Tell ScrollTrigger to use these proxy methods for the ".scroll-container" element
  ScrollTrigger.scrollerProxy(scrollContainer, {
    scrollTop(value) {
      return arguments.length 
        ? locomotiveInstance.scrollTo(value, 0, 0) 
        : locomotiveInstance.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight
      };
    },
    // LocomotiveScroll handles things completely differently on mobile devices
    pinType: scrollContainer.style.transform ? "transform" : "fixed"
  });

  // Update ScrollTrigger when locomotive scroll updates
  locomotiveInstance.on("scroll", ScrollTrigger.update);

  // After everything is set up, refresh ScrollTrigger
  ScrollTrigger.refresh();
};

// Setup Architecture Animation with ScrollTrigger
const setupArchitectureAnimation = () => {
  // Create the ScrollTrigger that will play the animation
  // when the architecture section comes into view
  ScrollTrigger.create({
    trigger: ".archi-container", 
    scroller: ".scroll-container",
    start: "top 80%", // When the top of the section is 80% from the top of viewport
    onEnter: () => animateArchitectureGrid(),
    markers: false, // Set to true for debugging
    once: true // Ensure animation only plays once
  });
};

// ParallaxImage component remains unchanged
const ParallaxImage = ({
  imageUrl,
  speed = 0.5,
  children,
  className = "",
  backgroundPosition = "center",
}) => {
  const [offset, setOffset] = useState(0);
  const parallaxRef = useRef(null);
  const requestRef = useRef();

  const animate = () => {
    if (parallaxRef.current) {
      const boundingRect = parallaxRef.current.getBoundingClientRect();
      const elementTop = boundingRect.top + window.pageYOffset;
      const offset = (window.pageYOffset - elementTop) * speed;
      setOffset(offset);
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div className={`parallax-container ${className}`} ref={parallaxRef}>
      <div
        className="parallax-image"
        style={{
          backgroundImage: `url(${imageUrl})`,
          transform: `translateY(${offset}px)`,
          backgroundPosition,
        }}
      />
      {children}
    </div>
  );
};

function Home() {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const bibiRef = useRef(null);
  const bibiSuperContainerRef = useRef(null);
  const crossSvgRef = useRef(null);
  const contentRefs = {
    archi: useRef(null),
    clothes: useRef(null),
    wbd: useRef(null),
    others: useRef(null),
  };

  const sectionRefs = {
    archi: useRef(null),
    clothes: useRef(null),
    wbd: useRef(null),
    others: useRef(null),
  };

  const menuTimeline = useRef(null);
  const menuOpen = useRef(false);
  const scrollContainerRef = useRef(null);
  const scrollInstanceRef = useRef(null);

  // References for each container
  const archiContainerRef = useRef(null);
  const clothesContainerRef = useRef(null);
  const wbdContainerRef = useRef(null);
  const othersContainerRef = useRef(null);

  // Create separate transition divs for each container
  const archiTransitionRef = useRef(null);
  const clothesTransitionRef = useRef(null);
  const wbdTransitionRef = useRef(null);
  const othersTransitionRef = useRef(null);

  useEffect(() => {
    // Set initial state for preview divs
    gsap.set([
      ".previewArchi",
      ".previewClothes",
      ".previewWbd",
      ".previewOther"
    ], {
      opacity: 0,
      x: 30,
      display: "block" // Make them always in the DOM but invisible
    });

    // Initialize GSAP menu timeline
    menuTimeline.current = gsap.timeline({ paused: true });

    gsap.set(".cross__circle", {
      strokeDasharray: 166,
    });

    gsap.set(".cross__path", {
      strokeDasharray: 48,
    });

    gsap.set(
      [
        contentRefs.archi.current,
        contentRefs.clothes.current,
        contentRefs.wbd.current,
        contentRefs.others.current,
      ],
      {
        opacity: 0,
        scale: 0.8,
        filter: "blur(10px)",
        y: 50,
      }
    );

    menuTimeline.current
      .to(menuRef.current, {
        height: "70vh",
        duration: 0.5,
        ease: "power2.inOut",
      })
      .to(bibiRef.current, {
        x: "-150px",
        y: "20px",
        duration: 0.25,
        ease: 'power2.inOut',
      }, "<")
      .to(".cross__circle", {
        strokeDasharray: 0,
        duration: 0.6,
        ease: "linear",
      }, '+=0.3')
      .to(".cross__path", {
        strokeDasharray: 0,
        duration: 0.3,
        ease: "linear",
        stagger: 0.1,
      }, "+=0.3")
      .to(contentRefs.archi.current, {
        opacity: 0.7,
        scale: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      })
      .to(
        contentRefs.clothes.current,
        {
          opacity: 0.7,
          scale: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.2"
      )
      .to(
        contentRefs.wbd.current,
        {
          opacity: 0.7,
          scale: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.2"
      )
      .to(
        contentRefs.others.current,
        {
          opacity: 0.7,
          scale: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        }, "-=0.2");

    // Initialize all transition divs
    gsap.set(
      [
        archiTransitionRef.current,
        clothesTransitionRef.current,
        wbdTransitionRef.current,
        othersTransitionRef.current,
      ],
      {
        bottom: "-100%",
      }
    );

    // Add hover effects for menu items
    const menuItems = [
      contentRefs.archi.current,
      contentRefs.clothes.current, 
      contentRefs.wbd.current,
      contentRefs.others.current
    ];
    
    menuItems.forEach(item => {
      if (item) {
        item.addEventListener('mouseenter', () => {
          gsap.to(item, {
            scale: 1.1,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        });
        
        item.addEventListener('mouseleave', () => {
          gsap.to(item, {
            scale: 1,
            opacity: 0.7,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      }
    });

    // Initialize Locomotive Scroll - SINGLE INITIALIZATION POINT
    setTimeout(() => {
      if (!scrollInstanceRef.current) {
        const scroll = new LocomotiveScroll({
          el: scrollContainerRef.current,
          smooth: true,
          lerp: 0.07,
          multiplier: 1,
          touchMultiplier: 2.5,
          smoothMobile: true,
          smartphone: { smooth: true },
          tablet: { smooth: true },
          scrollbarClass: "c-scrollbar",
          scrollingClass: "has-scroll-scrolling",
          draggingClass: "has-scroll-dragging",
          getDirection: true,
          reloadOnContextChange: true,
          resetNativeScroll: true,
        });

        scrollInstanceRef.current = scroll;

        // Initialize ScrollTrigger with Locomotive
        initScrollTriggerWithLocomotive(scrollContainerRef.current, scroll);
        
        // Setup architecture grid animation
        setupArchitectureAnimation();

        // Make all text elements visible
        document.querySelectorAll(".containerAll [data-scroll]").forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        });

        // Mark first section as visible
        document.querySelector(".containerAll").classList.add("is-inview");

        // Handle scroll events
        scroll.on('scroll', (args) => {
          const { currentElements, scroll } = args;

          // Adjust scroll speed at section boundaries
          if (
            (currentElements["containerAll"] && currentElements["containerAll"].progress > 0.8) ||
            (currentElements["parallax"] && (currentElements["parallax"].progress < 0.2 || currentElements["parallax"].progress > 0.8)) ||
            (currentElements["archi-section"] && (currentElements["archi-section"].progress < 0.2 || currentElements["archi-section"].progress > 0.8)) ||
            (currentElements["clothes-section"] && (currentElements["clothes-section"].progress < 0.2 || currentElements["clothes-section"].progress > 0.8)) ||
            (currentElements["wbd-section"] && (currentElements["wbd-section"].progress < 0.2 || currentElements["wbd-section"].progress > 0.8)) ||
            (currentElements["others-section"] && (currentElements["others-section"].progress < 0.2 || currentElements["others-section"].progress > 0.8))
          ) {
            scroll.lerp = 0.02; // Slower at boundaries
          } else {
            scroll.lerp = 0.07; // Normal speed
          }

          // Add is-inview class to visible sections
          Object.keys(currentElements).forEach((key) => {
            if (currentElements[key].inView) {
              const element = document.querySelector(`[data-scroll-id="${key}"]`);
              if (element) {
                element.classList.add('is-inview');
              }
            }
          });
        });
      }

      // Update on resize
      window.addEventListener('resize', () => {
        if (scrollInstanceRef.current) {
          scrollInstanceRef.current.update();
        }
        ScrollTrigger.refresh();
      });
    }, 100);

    return () => {
      // Clean up hover event listeners
      menuItems.forEach(item => {
        if (item) {
          // Use similar anonymous functions for removal
          item.removeEventListener('mouseenter', () => {});
          item.removeEventListener('mouseleave', () => {});
        }
      });
      
      // Clean up on unmount
      if (scrollInstanceRef.current) {
        scrollInstanceRef.current.destroy();
        scrollInstanceRef.current = null;
      }
      
      // Kill all ScrollTriggers
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      // Cancel any active GSAP animations
      gsap.killTweensOf([
        menuRef.current, 
        bibiRef.current, 
        ".cross__circle", 
        ".cross__path",
        contentRefs.archi.current,
        contentRefs.clothes.current,
        contentRefs.wbd.current,
        contentRefs.others.current,
        ".previewArchi",
        ".previewClothes",
        ".previewWbd",
        ".previewOther",
        ".grid-Archi",
        ".grid-Archi1",
        ".grid-Archi2",
        ".grid-Archi3",
        ".grid-Archi4",
        ".grid-Archi5",
        ".grid-Archi6"
      ]);
    };
  }, []);

  // Handle bibi click - this will now only toggle the menu
  const handleBibiClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    toggleMenu();
  };
  
  // Handle cross SVG click - this will close the menu
  const handleCrossClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (menuOpen.current) {
      toggleMenu();
    }
  };
  
  // Toggle menu function
  const toggleMenu = () => {
    if (menuTimeline.current) {
      if (!menuOpen.current) {
        menuTimeline.current.play();
      } else {
        menuTimeline.current.reverse();
        gsap.set(".cross__circle", {
          strokeDashoffset: 166
        });
        gsap.set(".cross__path", {
          strokeDashoffset: 48
        });
      }
      menuOpen.current = !menuOpen.current;
    }
  };

  // Fixed scrollToSection function to work properly with Locomotive Scroll
  const scrollToSection = (ref) => {
    if (ref.current && scrollInstanceRef.current) {
      // Close menu first
      if (menuOpen.current) {
        menuTimeline.current.reverse();
        menuOpen.current = false;
        
        gsap.set(".cross__circle", {
          strokeDashoffset: 166
        });
        gsap.set(".cross__path", {
          strokeDashoffset: 48
        });
      }
      
      // Wait for menu animation to complete before scrolling
      setTimeout(() => {
        scrollInstanceRef.current.scrollTo(ref.current, {
          offset: 0,
          duration: 1000,
          easing: [0.25, 0.0, 0.35, 1.0],
          disableLerp: false // Keep smooth scrolling during programmatic scrolling
        });
      }, menuOpen.current ? 700 : 0); // Delay if menu was open
    }
  };

  // Enhanced transition function for page transitions
  const handleCardClick = (destination, containerRef, transitionRef) => {
    // Stop Locomotive Scroll temporarily
    if (scrollInstanceRef.current) {
      scrollInstanceRef.current.stop();
    }

    // Set the transition div color
    gsap.set(transitionRef.current, {
      backgroundColor: "red", // Use a default color
      bottom: "-100%",
    });

    // Create transition timeline
    const tl = gsap.timeline({
      onComplete: () => {
        navigate(destination);
      },
    });

    // Use Locomotive Scroll for the initial scroll to section
    if (scrollInstanceRef.current) {
      scrollInstanceRef.current.scrollTo(containerRef.current, {
        offset: 0,
        duration: 500,
        easing: [0.25, 0.0, 0.35, 1.0],
        callback: () => {
          // After scrolling, continue with the visual transition
          tl.to(containerRef.current.querySelector("div"), {
            duration: 0.3,
            scale: 1.05,
            ease: "power1.out",
          }).to(transitionRef.current, {
            duration: 0.8,
            bottom: "0%",
            ease: "power2.inOut",
          });
        }
      });
    } else {
      // Fallback if Locomotive Scroll is not available
      tl.to(window, {
        duration: 0.5,
        scrollTo: { y: containerRef.current, offsetY: 0 },
        ease: "power2.inOut",
      })
        .to(containerRef.current.querySelector("div"), {
          duration: 0.3,
          scale: 1.05,
          ease: "power1.out",
        })
        .to(transitionRef.current, {
          duration: 0.8,
          bottom: "0%",
          ease: "power2.inOut",
        });
    }
  };

  // Handlers for menu item hover effects
  const handleMenuItemMouseEnter = (ref) => {
    if (ref.current) {
      gsap.to(ref.current, {
        scale: 1.1,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };
  
  const handleMenuItemMouseLeave = (ref) => {
    if (ref.current) {
      gsap.to(ref.current, {
        scale: 1,
        opacity: 0.7,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  return (
    <div
      className="scroll-container"
      data-scroll-container
      ref={scrollContainerRef}
    >
      {/* Debug markers if needed */}
      <div className="suite"></div>
      <div className="suite1"></div>

      {/* Initial welcome section */}
      <div
        className="containerAll scroll-section"
        data-scroll-section
        data-scroll-id="containerAll"
      >
        <div className="bibiContainer">
          <div className="bibiSuperContainer" ref={bibiSuperContainerRef}>
            <div className="menuBibi" ref={menuRef} onClick={(e) => e.stopPropagation()}>
              <div className="bibiContent">
                {/* Content items - Only these and the cross should be clickable */}
                <div 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    scrollToSection(sectionRefs.archi);
                  }} 
                  onMouseEnter={() => {
                    handleMenuItemMouseEnter(contentRefs.archi);
                    previewBeVisible('previewArchi');
                  }}
                  onMouseLeave={() => {
                    handleMenuItemMouseLeave(contentRefs.archi);
                    previewDontBeVisible('previewArchi');
                  }}
                  ref={contentRefs.archi} 
                  className="archibibi transition-all duration-300"
                >
                  Curriculum Vitae 
                </div>
                <div className="previewArchi"></div>
                
                <div 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    scrollToSection(sectionRefs.clothes);
                  }} 
                  onMouseEnter={() => {
                    handleMenuItemMouseEnter(contentRefs.clothes);
                    previewBeVisible('previewClothes');
                  }}
                  onMouseLeave={() => {
                    handleMenuItemMouseLeave(contentRefs.clothes);
                    previewDontBeVisible('previewClothes');
                  }}
                  ref={contentRefs.clothes} 
                  className="clotheibibi transition-all duration-300"
                >
                  Blender
                </div>
                <div className="previewClothes"></div>
                
                <div 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    scrollToSection(sectionRefs.wbd);
                  }} 
                  onMouseEnter={() => {
                    handleMenuItemMouseEnter(contentRefs.wbd);
                    previewBeVisible('previewWbd');
                  }}
                  onMouseLeave={() => {
                    handleMenuItemMouseLeave(contentRefs.wbd);
                    previewDontBeVisible('previewWbd');
                  }}
                  ref={contentRefs.wbd} 
                  className="wbdbibi transition-all duration-300"
                >
                  Web Design
                </div>
                <div className="previewWbd"></div>
                
                <div 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    scrollToSection(sectionRefs.others);
                  }} 
                  onMouseEnter={() => {
                    handleMenuItemMouseEnter(contentRefs.others);
                    previewBeVisible('previewOther');
                  }}
                  onMouseLeave={() => {
                    handleMenuItemMouseLeave(contentRefs.others);
                    previewDontBeVisible('previewOther');
                  }}
                  ref={contentRefs.others} 
                  className="otherbibi transition-all duration-300"
                >
                  Contact me !
                </div>
                <div className="previewOther"></div>
                
                {/* Cross SVG - Only this should be clickable to close the menu */}
                <svg 
                  className="cross__svg" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 52 52"
                  ref={crossSvgRef}
                  onClick={handleCrossClick}
                >
                  <circle className="cross__circle" cx="26" cy="26" r="25" fill="none" />
                  <path className="cross__path cross__path--right" fill="none" d="M16,16 l20,20" />
                  <path className="cross__path cross__path--right" fill="none" d="M16,36 l20,-20" />
                </svg>
              </div>
            </div>
          </div>
          {/* Bibi element - Clickable to open the menu */}
          <div className="bibi" ref={bibiRef} onClick={handleBibiClick}></div>
        </div>
        <div className="links">
          <a className="github" href="https://www.twitch.tv/fatiiiih">
            Github
          </a>
          <a
            className="figma"
            href="https://www.instagram.com/watermeloon.music/"
          >
            Figma
          </a>
          <a
            className="linkedin"
            href="https://www.karminecorp.fr/collections/campus/products/polo-campus-beige"
          >
            Linkedin
          </a>
        </div>
        <div className="welcome-to forced-visible">
          <div className="welcome">Welcome to my</div>
        </div>
        <div className="my-portfolio forced-visible">PORTFOLIO</div>
      </div>

      {/* Parallax section */}
      <div
        className="scroll-section"
        data-scroll-section
        data-scroll-id="parallax"
      >
        <ParallaxImage
          imageUrl="https://zupimages.net/up/25/15/9zz5.png"
          speed={0.3}
          className="fullscreen-parallax"
        />
      </div>

      {/* Transition divs for each section */}
      <div
        className="transition archi-transition"
        ref={archiTransitionRef}
      ></div>
      <div
        className="transition clothes-transition"
        ref={clothesTransitionRef}
      ></div>
      <div className="transition wbd-transition" ref={wbdTransitionRef}></div>
      <div
        className="transition others-transition"
        ref={othersTransitionRef}
      ></div>

      {/* Architecture Container */}
      <div
        className="archi-container scroll-section"
        data-scroll-section
        data-scroll-id="archi-section"
        ref={sectionRefs.archi}
        data-scroll
      >
        <div
          className="architecture"
          data-scroll
          ref={archiContainerRef}
        >
          <div className="grid-Archi">Bultel Alan
            <p>Radiant</p>
          </div>
          <div className="grid-Archi1">
            <div className="age"></div>
            <div className="photo"></div>
          </div>
          <div className="grid-Archi2"> Compétences
            <div className="technologiesFrontEnd"></div>
            <div className="technologiesBackEnd"></div>
          </div>
          <div className="grid-Archi3">Experiences
          <div className="experience"></div>
          <div className="experience1"></div>
          </div>
          
          <div className="grid-Archi4">Formation
            <div className="formation"></div>
            <div className="formation1"></div>          
            </div>
          <div className="grid-Archi5">Loisirs
            <div className="loisirs">
            </div>
          </div>
          <div className="grid-Archi6"
            onClick={(e) => { e.stopPropagation(); scrollToSection(sectionRefs.others);}}>
            contact me
          </div>
        </div>
      </div>

      {/* Clothes Container */}
      <div
        className="clothes-container scroll-section"
        data-scroll-section
        data-scroll-id="clothes-section"
        ref={sectionRefs.clothes}
        data-scroll
      >
        <div
          className="clothes"
          data-scroll
          ref={clothesContainerRef}
          onClick={() =>
            handleCardClick(
              "/Blender",
              clothesContainerRef,
              clothesTransitionRef
            )
          }
        >
          <div className="clothesDescriptionContainer"></div>
          <div className="clothesDescription">Last Project</div>
        </div>
        <div className="clothesText">
        <div className="clothesText1">
          I started learning Blender at the beginning of 2025, 
        I've already done a few projects and some of them using ThreeJS. 
        I'm constantly learning in this field and 
        I really enjoy it because curiosity makes me want to take on bigger challenges.</div>
        </div>
      </div>

      {/* Web Design Container */}
      <div
        className="wbd-container scroll-section"
        data-scroll-section
        data-scroll-id="wbd-section"
        ref={sectionRefs.wbd}
        data-scroll
      >
        <div
          className="webDesign"
          data-scroll
          ref={wbdContainerRef}
          onClick={() =>
            handleCardClick("/WebDesign", wbdContainerRef, wbdTransitionRef)
          }
        >
          Web Design
        </div>
        <div className="wbdText"></div>
      </div>

      {/* Others Container */}
      <div
        className="others-container scroll-section"
        data-scroll-section
        data-scroll-id="others-section"
        ref={sectionRefs.others}
        data-scroll
      >
        <div className="upperCovering"></div>
        <div className="covering"></div>
        <div
          className="others"
          data-scroll
          ref={othersContainerRef}
        >
          <div className="othersText2">HAVE A PROJECT IN MIND ?</div>
          <div className="othersText">LET'S CREATE</div>
          <div className="othersText1">GREAT THINGS TOGETHER</div>
          <button className="sendMail">Bultel0alan@gmail.com</button>
        </div>
      </div>
    </div>
  );
}

export default Home;