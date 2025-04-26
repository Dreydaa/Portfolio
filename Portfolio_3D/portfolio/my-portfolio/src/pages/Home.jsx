import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import "./../styles/mediaQuery.css";
import "../components/App";
import { gsap } from "gsap";
import { Github as GitHub, Figma, Linkedin, Instagram, BlendIcon, ArrowRightCircle } from 'lucide-react';

function openEmail() {
  window.location.href = "mailto:Bultel0alan@gmail.com";
}

function Home() {

  const handleDownload = () => {
    // Generate the PDF
    const pdfData = '../../public/Resume.pdf';

    // Create an anchor element and set properties for download
    const link = document.createElement('a');
    link.href = pdfData;
    link.download = 'Alan Bultel Curriculum Vitae.pdf';

    // Append to the document, click and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const navigate = useNavigate();

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


  const scrollInstanceRef = useRef(null);

  // References for each container
  const clothesContainerRef = useRef(null);
  const wbdContainerRef = useRef(null);

  const clothesTransitionRef = useRef(null);
  const wbdTransitionRef = useRef(null);

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

  document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const triggerSection = document.querySelector('section');

    // Create an intersection observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Header is over the dark section
          header.classList.add('header-inverted');
        } else {
          // Header is not over the dark section
          header.classList.remove('header-inverted');
        }
      });
    }, { threshold: 0.1 }); // Trigger when at least 10% of the section is visible

    // Start observing the trigger section
    observer.observe(triggerSection);
  });



  return (
    <>

      <header>
        <span className="logoAB">AB</span>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#work">Work</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="https://www.instagram.com/alan.dyd/" className="logo" target="_blank"><Instagram size={24} color="white" /></a></li>
          <li><a href="https://www.linkedin.com/in/alan-bultel/" target="_blank" className="logo"><Linkedin size={24} color="white" /></a></li>
        </ul>
      </header>

      <section id="home">
        <div className="stickyContainer">
          <h1>Alan Bultel</h1>
        </div>
      </section>

      <section id="work">
        <span className="transitionBar"></span>
        <h2>Work</h2>
        <div className="workContainer">
          <div className="work">
            <h4>Blender Project</h4>
            <button classList onClick={() =>
              handleCardClick(
                "/Blender",
                clothesContainerRef,
                clothesTransitionRef
              )
            }
              className="redirectBlender">

            </button>
          </div>
          <div className="work">
            <h4>Web Dev Project</h4>
            <button onClick={() =>
              handleCardClick(
                "/WebDesign",
                wbdContainerRef,
                wbdTransitionRef
              )
            }
              className="redirectwbd">
            </button>
          </div>
        </div>

      </section>

      <section id="about">
        <span className="transitionBar"></span>

        <h2>About</h2>
        <div className="colContainer">
          <p className="bigTxt maxWidthTxt">I’m Alan — a Full-Stack student Developer. I like to create things like elements or sets on Blender, I also like to create websites using Three or other, I'm currently a student at Zone01 Normandie . Currently based in Rouen, France.</p>
          <p className="maxWidthTxt">I have experience in application development and maintenance, particularly through internships and projects. I know how to work with databases, APIs and software development tools. My experience also includes working with cross-functional teams to deliver high quality software.</p>
        </div>
        <div className="stickyContainer">
          <span className="transitionBar medium"></span>
          <h2>Experience</h2>
        </div>

        <div className="super">
          <div className="experienceContainerCol">
            <span className="ExpBar"></span>
            <div className="experienceContainer">
              <h3>Internship - Software Developer</h3>
              <h4>Idex - Taranis du Rouvray</h4>
            </div>
            <p>January 2025 - March 2025</p>
            <span className="ExpBar"></span>
            <div className="experienceContainer">
              <h3>Internship - Project Manager Assistant in a Design Office</h3>
              <h4>Rouen Habitat</h4>
            </div>
            <p>May 2021 - July 2021</p>
            <button className="ExpButton" onClick={handleDownload}>
              <span className="chiant">See full CV</span><ArrowRightCircle className="arrow" size={24} color="white" />
            </button>
          </div>
        </div>
      </section>

      <section id="about">

        <span className="transitionBar"></span>
        <h2>Skills</h2>
        <div className="skillContainer">
          <div className="skill">
            <span className="skillBar"></span>
            <h3>Front-End Development</h3>
            <p className="skillTxt">HTML, CSS, JavaScript, React, ThreeJS</p>
          </div>
          <div className="skill">
            <span className="skillBar"></span>
            <h3>Back-End Development</h3>
            <p className="skillTxt">NodeJS, Vite.js, MySQL, Golang</p>
          </div>
          <div className="skill">
            <span className="skillBar"></span>
            <h3>3D Modeling & Rendering</h3>
            <p className="skillTxt">UV mapping, Materials, Texturing</p>
          </div>
          <div className="skill">
            <span className="skillBar"></span>
            <h3>UI/UX Design</h3>
            <p className="skillTxt">Figma, Design systems, Prototyping</p>
          </div>
          <div className="skill">
            <span className="skillBar"></span>
            <h3>Teamwork & Creativity</h3>
            <p className="skillTxt">Git, Agile, Design thinking</p>
          </div>
          <div className="skill">
            <span className="skillBar"></span>
            <h3>Lighting & Simulation</h3>
            <p className="skillTxt">EEVEE, Cycles, Physics Sims</p>
          </div>
          
        </div>

        <div className="stickyContainer">
          <span className="transitionBar medium"></span>
          <h2>Interests</h2>
        </div>

        <div className="interestsContainer">
          <div className="gridInterests">
            <div className="gridItem grid1"></div>
            <div className="gridItem grid2"></div>
            <div className="gridItem grid3"></div>
            <div className="gridItem grid4"></div>
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="contactContainer">
          <h3 className="ct">HAVE A PROJECT IN MIND ?</h3>
          <div className="create">
            <h5>LET'S CREATE</h5>
            <h5>GREAT THINGS TOGETHER</h5></div>

          <button onClick={openEmail} className="mailBtn"><span className="chiant">Bultel0alan@gmail.com</span></button>
        </div>
      </section>

    </>
  );
}

export default Home;