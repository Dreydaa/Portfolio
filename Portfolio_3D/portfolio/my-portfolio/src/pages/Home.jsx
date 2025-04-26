import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import "../styles/fdd.scss";
import "../components/App";
import { gsap } from "gsap";
import { Github as GitHub, Figma, Linkedin, Mail, ArrowUpRight, Code2, Database, Palette, Users, Box, Lightbulb, ArrowBigDown, ArrowDown, ArrowDownIcon, ArrowRight, Github } from 'lucide-react';

function Home() {
   const navigate = useNavigate();
   
       const transitionOverlayRef = useRef(null);
   
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
          <li><a href="#" className="logo"><Github size={24}/></a></li>
          <li><a href="#" className="logo"><Linkedin size={24}/></a></li>
        </ul>
      </header>

      <section id="home">
      <div class="stickyContainer">
        <h1>Alan Bultel</h1>
      </div>
      </section>

      <section id="work">
      <span className="transitionBar"></span>
        <h2>Work</h2>
        <div class="workContainer">
        <div class="work">
            <h4>Project in Blender</h4>
            <button onClick={() =>
            handleCardClick(
              "/Blender",
              clothesContainerRef,
              clothesTransitionRef
            )
          }
          class="redirectBlender"></button>
          </div>
          <div class="work">
            <h4>Project in web development</h4>
            <button onClick={() =>
            handleCardClick(
              "/WebDesign",
              wbdContainerRef,
              wbdTransitionRef
            )
          }
          class="redirectBlender"></button>
          </div>
          </div>
          
      </section>

      <section id="about">
        <span className="transitionBar"></span>

        <h2>About</h2>
        <div className="colContainer">
          <p className="bigTxt maxWidthTxt">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam quis lobortis nulla. Aliquam tortor quam, ultrices vitae erat sit amet, egestas ultricies quam. Nunc eu bibendum urna.</p>
          <p className="maxWidthTxt">Cras arcu tellus, vulputate id ullamcorper eu, facilisis et nulla. Nam quis sodales velit, molestie ornare ex. Phasellus ut leo lectus. Proin quis nibh eu lacus ultrices faucibus. Morbi vestibulum, nulla ut pulvinar volutpat dolor mi luctus tellus, in efficitur risus mauris eu metus. In congue felis ut dui consequat suscipit et vel ex. Ut fringilla auctor euismod. Fusce vel tellus libero. In et lobortis nunc. Proin in auctor ligula. Curabitur id quam eu tellus imperdiet feugiat eget id velit. Etiam lobortis porttitor tempor. Nulla facilisi. Phasellus scelerisque mattis felis ac vehicula. Vestibulum feugiat, ante eget egestas imperdiet, turpis mauris volutpat purus, vel euismod dui nulla in sem. Proin consectetur est auctor urna semper tempus.</p>
        </div>
        <div class="stickyContainer">
          <span className="transitionBar medium"></span>
          <h2>Experience</h2>
        </div>

        <div className="super">
          <div className="experienceContainerCol">
            <span class="ExpBar"></span>
            <div className="experienceContainer">
              <h3>Front-End Developer</h3>
              <h4>Freelance</h4>
            </div>
            <p>2025</p>
            <span class="ExpBar"></span>
            <div className="experienceContainer">
              <h3>Front-End Developer</h3>
              <h4>Freelance</h4>
            </div>
            <p>2025</p>
            <button className="ExpButton">See full CV</button>
          </div>
        </div>
      </section>

      <section id="about">

        <span className="transitionBar"></span>
        <h2>Skills</h2>
        <div class="skillContainer">
          <div class="skill">
            <span class="skillBar"></span>
            <h3>Front-End Development</h3>
            <p class="skillTxt">HTML, CSS, JavaScript, React, ThreeJS</p>
          </div>
          <div class="skill">
            <span class="skillBar"></span>
            <h3>Back-End Development</h3>
            <p class="skillTxt">NodeJS, Vite.js, MySQL, Golang</p>
          </div>
        </div>

        <div class="stickyContainer">
          <span class="transitionBar medium"></span>
          <h2>Interests</h2>
        </div>

        <div class="interestsContainer">
          <div class="gridInterests">
            <div class="gridItem grid1"></div>
            <div class="gridItem grid2"></div>
            <div class="gridItem grid3"></div>
            <div class="gridItem grid4">russkovski</div>
            <div class="gridItem grid5">fesse</div>
            <div class="gridItem grid6">futbol</div>
            <div class="gridItem grid7">futbol</div>
            <div class="gridItem grid8">futbol</div>
            <div class="gridItem grid9">futbol</div>
            <div class="gridItem grid10">futbol</div>
            <div class="gridItem grid11">futbol</div>
            <div class="gridItem grid12">futbol</div>
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="contactContainer">
          <h3 className="ct">HAVE A PROJECT IN MIND ?</h3>
          <div className="create">
            <h5>LET'S CREATE</h5>
            <h5>GREAT THINGS TOGETHER</h5></div>
          
          <button className="mailBtn">Mail@gmail.com</button>
        </div>
      </section>

    </>
  );
}

export default Home;