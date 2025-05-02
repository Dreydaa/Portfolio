import { useState, useEffect } from 'react';
import { Linkedin, Menu, X, Instagram } from 'lucide-react';
import "../styles/App.css";
import "./../styles/mediaQuery.css"
function BurgerMenu() {
    const [isOpen, setIsOpen] = useState(false);
    
    // Close menu when clicking outside
    useEffect(() => {
      const handleClickOutside = (e) => {
        const menu = document.querySelector('.mobile-menu');
        const burger = document.querySelector('.burger-button');
        
        if (isOpen && menu && !menu.contains(e.target) && !burger.contains(e.target)) {
          setIsOpen(false);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);
    
    // Close menu on resize above breakpoint
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth > 781 && isOpen) {
          setIsOpen(false);
        }
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [isOpen]);
  
    const toggleMenu = () => {
      const newState = !isOpen;
      setIsOpen(newState);
      
      // Dispatch custom event for the body class toggling
      window.dispatchEvent(new CustomEvent('menuToggle', { 
        detail: { isOpen: newState } 
      }));
    };
  
    return (
      <div className="burger-menu-container">
        <button 
          className="burger-button" 
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? 
            <X size={24} color="white" /> : 
            <Menu size={24} color="white" />
          }
        </button>
        
        {isOpen && (
          <div className="mobile-menu">
            <ul>
              <li><a href="#home" onClick={() => setIsOpen(false)}>Home</a></li>
              <li><a href="#about" onClick={() => setIsOpen(false)}>About</a></li>
              <li><a href="#work" onClick={() => setIsOpen(false)}>Work</a></li>
              <li><a href="#contact" onClick={() => setIsOpen(false)}>Contact</a></li>
              <li className="social-icons">
              <a href="https://www.instagram.com/alan.dyd/" className="logo" target="_blank"><Instagram size={24} /></a>
               <a href="https://www.linkedin.com/in/alan-bultel/" target="_blank" className="logo"><Linkedin size={24} /></a>
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  }
  
  export default BurgerMenu;