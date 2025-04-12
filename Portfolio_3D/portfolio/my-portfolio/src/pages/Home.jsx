import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import "../components/App";
import LocomotiveScroll from "locomotive-scroll";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Enregistrer le plugin ScrollTo de GSAP
gsap.registerPlugin(ScrollToPlugin);

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
  const menuRef = useRef(null);
  const bibiRef = useRef(null);
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

  useEffect(() => {
    menuTimeline.current = gsap.timeline({ paused: true });

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
      .to(contentRefs.archi.current, {
        opacity: 0.7,
        scale: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      }, '<')
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
        },
        "=0.2"
      );
  }, []);

  const handleMenuClick = () => {
    if (menuTimeline.current) {
      if (!menuOpen.current) {
        menuTimeline.current.play();
      } else{
        menuTimeline.current.reverse();
      }
      menuOpen.current = !menuOpen.current;
    }
  };

  const scrollToSection = (ref) => {
    if (ref.current) {
      menuTimeline.current.reverse();
      menuOpen.current = false;

      gsap.to(window, {
        duration: 1,
        scrollTo: {
          y: ref.current,
          autoKill: false,
        },
        ease: "power2.inOut",
      });
    }
  };

  const navigate = useNavigate();
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

  // Enhanced transition function with container-specific transitions
  const handleCardClick = (destination, containerRef, transitionRef) => {
    // Désactiver temporairement Locomotive Scroll
    if (scrollInstanceRef.current) {
      scrollInstanceRef.current.stop();
    }

    // Get the color from the clicked element to match the transition color
    const computedStyle = window.getComputedStyle(
      containerRef.current.querySelector("div")
    );
    const backgroundColor = computedStyle.backgroundColor;

    // Set the transition div color to match the clicked element
    gsap.set(transitionRef.current, {
      backgroundColor: backgroundColor,
      bottom: "-100%", // Ensure it starts from below
    });

    const tl = gsap.timeline({
      onComplete: () => {
        // Navigate after transition completes
        navigate(destination);
      },
    });

    // Scroll to the container first
    tl.to(window, {
      duration: 0.5,
      scrollTo: { y: containerRef.current, offsetY: 0 },
      ease: "power2.inOut",
    })
      // Scale the clicked element
      .to(containerRef.current.querySelector("div"), {
        duration: 0.3,
        scale: 1.05,
        ease: "power1.out",
      })
      // Bring in the transition from bottom
      .to(transitionRef.current, {
        duration: 0.8,
        bottom: "0%",
        ease: "power2.inOut",
      });
  };

  useEffect(() => {
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

    // Attendre que les éléments du DOM soient complètement chargés
    setTimeout(() => {
      // Rendre les textes visibles immédiatement
      document.querySelectorAll(".containerAll [data-scroll]").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });

      // Initialiser Locomotive Scroll pour un défilement fluide
      const scroll = new LocomotiveScroll({
        el: scrollContainerRef.current,
        smooth: true,
        lerp: 0.07,
        multiplier: 1,
        touchMultiplier: 2.5,
        smoothMobile: true,
        smartphone: {
          smooth: true,
        },
        tablet: {
          smooth: true,
        },

        // Add section snapping behavior
        scrollbarClass: "c-scrollbar",
        scrollingClass: "has-scroll-scrolling",
        draggingClass: "has-scroll-dragging",
        // Enhanced settings for section snapping
        getDirection: true,
        reloadOnContextChange: true,
        resetNativeScroll: true,
      });

      scrollInstanceRef.current = scroll;

      // Marquer la première section comme visible
      document.querySelector(".containerAll").classList.add("is-inview");

      // Handle transitions between sections
      scroll.on("scroll", (args) => {
        const { currentElements, scroll } = args;

        // Adjust scroll speed at section boundaries
        if (
          (currentElements["containerAll"] &&
            currentElements["containerAll"].progress > 0.8) ||
          (currentElements["parallax"] &&
            (currentElements["parallax"].progress < 0.2 ||
              currentElements["parallax"].progress > 0.8)) ||
          (currentElements["archi-section"] &&
            (currentElements["archi-section"].progress < 0.2 ||
              currentElements["archi-section"].progress > 0.8)) ||
          (currentElements["clothes-section"] &&
            (currentElements["clothes-section"].progress < 0.2 ||
              currentElements["clothes-section"].progress > 0.8)) ||
          (currentElements["wbd-section"] &&
            (currentElements["wbd-section"].progress < 0.2 ||
              currentElements["wbd-section"].progress > 0.8)) ||
          (currentElements["others-section"] &&
            (currentElements["others-section"].progress < 0.2 ||
              currentElements["others-section"].progress > 0.8))
        ) {
          scroll.lerp = 0.02; // Slower at boundaries
        } else {
          scroll.lerp = 0.07; // Normal speed
        }

        // Add is-inview class to visible sections for animation triggering
        Object.keys(currentElements).forEach((key) => {
          if (currentElements[key].inView) {
            const element = document.querySelector(`[data-scroll-id="${key}"]`);
            if (element) {
              // Check if element exists before accessing classList
              element.classList.add("is-inview");

              if (
                currentElements[key].progress > 0.4 &&
                currentElements[key].progress < 0.6
              ) {
                scroll.scrollTo(element, {
                  offset: -(window.innerHeight - element.offsetHeight) / 2,
                  duration: 800,
                  easing: [0.25, 0.0, 0.35, 1.0],
                  disableLerp: false,
                });
              }
            }
          }
        });
      });

      // Update on resize
      window.addEventListener("resize", () => {
        if (scrollInstanceRef.current) {
          scrollInstanceRef.current.update();
        }
      });
    }, 100);

    return () => {
      if (scrollInstanceRef.current) {
        scrollInstanceRef.current.destroy();
      }
    };
  }, []);

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
        <div className="bibiContainer" onClick={handleMenuClick}>
          <div className="bibiSuperContainer">
            <div className="menuBibi" ref={menuRef}>
              <div className="bibiContent">
                <div onClick={(e) => {e.stopPropagation(); scrollToSection(sectionRefs.archi)}} ref={contentRefs.archi} className="archibibi hover:opacity-100 transition-opacity duration-300">Architecture </div>
                <div onClick={(e) => {e.stopPropagation(); scrollToSection(sectionRefs.clothes)}} ref={contentRefs.clothes} className="clotheibibi hover:opacity-100 transition-opacity duration-300">CLothing </div>
                <div onClick={(e) => {e.stopPropagation(); scrollToSection(sectionRefs.wbd)}} ref={contentRefs.wbd} className="wbdbibi hover:opacity-100 transition-opacity duration-300">Web Design </div>
                <div onClick={(e) => {e.stopPropagation(); scrollToSection(sectionRefs.others)}} ref={contentRefs.others} className="otherbibi hover:opacity-100 transition-opacity duration-300">Miscellaneous </div>
              </div>
              <div className="bibimap"></div>
            </div>
          </div>
          <div className="bibi" ref={bibiRef}></div>
        </div>

        <div className="return-magz">
          <a className="magzz" href="https://dondesang.efs.sante.fr/">
            Go back to the menu
          </a>
          <div className="row"></div>
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
        ref={archiContainerRef}
      >
        <div
          className="architecture"
          data-scroll
          onClick={() =>
            handleCardClick(
              "/Architecture",
              archiContainerRef,
              archiTransitionRef
            )
          }
        >
          Architecture
        </div>
      </div>

      {/* Clothes Container */}
      <div
        className="clothes-container scroll-section"
        data-scroll-section
        data-scroll-id="clothes-section"
        ref={clothesContainerRef}
      >
        <div
          className="clothes"
          data-scroll
          onClick={() =>
            handleCardClick(
              "/Clothes",
              clothesContainerRef,
              clothesTransitionRef
            )
          }
        >
          Clothes
        </div>
      </div>

      {/* Web Design Container */}
      <div
        className="wbd-container scroll-section"
        data-scroll-section
        data-scroll-id="wbd-section"
        ref={wbdContainerRef}
      >
        <div
          className="webDesign"
          data-scroll
          onClick={() =>
            handleCardClick("/Animation", wbdContainerRef, wbdTransitionRef)
          }
        >
          Web Design
        </div>
      </div>

      {/* Others Container */}
      <div
        className="others-container scroll-section"
        data-scroll-section
        data-scroll-id="others-section"
        ref={othersContainerRef}
      >
        <div
          className="others"
          data-scroll
          onClick={() =>
            handleCardClick("/Other", othersContainerRef, othersTransitionRef)
          }
        >
          Others
        </div>
      </div>
    </div>
  );
}

export default Home;
