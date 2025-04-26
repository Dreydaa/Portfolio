// Function to handle navigation and scrolling
document.addEventListener('DOMContentLoaded', function() {
  // Get all navigation links (assuming you have nav links for sections)
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  // Add click event listener to each link
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Scroll to the top of the target section
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // If you have next/previous buttons
  const nextButtons = document.querySelectorAll('.nextButton');
  nextButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Assuming each button has a data attribute for the target section
      const targetId = this.getAttribute('data-target');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Scroll to the top of the target section
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
});