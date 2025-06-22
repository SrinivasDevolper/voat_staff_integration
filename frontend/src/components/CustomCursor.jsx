import React, { useEffect, useState, useRef } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorType, setCursorType] = useState('default');
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;

    if (!cursor || !dot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let dotX = 0;
    let dotY = 0;

    const updateCursorPosition = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setPosition({ x: mouseX, y: mouseY });
    };

    const animateCursor = () => {
      // Smooth cursor movement
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      
      // Smooth dot movement (faster)
      dotX += (mouseX - dotX) * 0.3;
      dotY += (mouseY - dotY) * 0.3;

      if (cursor && dot) {
        cursor.style.transform = `translate(${cursorX - 12}px, ${cursorY - 12}px)`;
        dot.style.transform = `translate(${dotX - 3}px, ${dotY - 3}px)`;
      }

      requestAnimationFrame(animateCursor);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseEnter = (e) => {
      setIsHovering(true);
      
      // Determine cursor type based on element
      const target = e.target;
      const tagName = target.tagName.toLowerCase();
      const className = target.className || '';
      const id = target.id || '';
      
      // Check for specific website elements
      if (tagName === 'button' || 
          className.includes('btn') || 
          className.includes('button') ||
          target.closest('button') ||
          className.includes('bg-blue-600') ||
          className.includes('bg-gradient') ||
          id.includes('button') ||
          target.getAttribute('role') === 'button') {
        setCursorType('button');
      } else if (tagName === 'a' || 
                 target.closest('a') || 
                 className.includes('link') ||
                 className.includes('cursor-pointer') ||
                 target.onclick ||
                 target.getAttribute('onclick')) {
        setCursorType('link');
      } else if (tagName === 'input' || 
                 tagName === 'textarea' || 
                 target.contentEditable === 'true' || 
                 className.includes('input') ||
                 className.includes('form') ||
                 target.getAttribute('type') === 'text' ||
                 target.getAttribute('type') === 'email' ||
                 target.getAttribute('type') === 'password') {
        setCursorType('text');
      } else {
        setCursorType('default');
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setCursorType('default');
    };

    // Add global event listeners
    document.addEventListener('mousemove', updateCursorPosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Start animation loop
    animateCursor();

    // Add hover listeners to all interactive elements
    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(`
        button, 
        a, 
        input, 
        textarea, 
        [contenteditable], 
        .interactive,
        .cursor-pointer,
        [role="button"],
        .btn,
        .button,
        .link,
        .clickable,
        [onclick],
        .bg-blue-600,
        .bg-gradient,
        .hover\\:bg-blue-700,
        .hover\\:scale-105,
        .hover\\:shadow-lg,
        .transition-all,
        .rounded-full,
        .rounded-lg,
        .shadow-md,
        .shadow-lg
      `);
      
      interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    // Initial setup
    addHoverListeners();

    // Re-run on route changes (for SPA)
    const observer = new MutationObserver(() => {
      setTimeout(addHoverListeners, 100); // Small delay to ensure DOM is ready
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Also re-run when window gains focus (for better SPA support)
    window.addEventListener('focus', addHoverListeners);

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('focus', addHoverListeners);
      observer.disconnect();
    };
  }, []);

  // Don't render on mobile
  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    return null;
  }

  const cursorClasses = `custom-cursor ${cursorType} ${isHovering ? 'hover' : ''} ${isClicking ? 'click' : ''}`;
  const dotClasses = `cursor-dot ${isHovering ? 'hover' : ''} ${isClicking ? 'click' : ''} ${cursorType === 'text' ? 'text' : ''}`;

  return (
    <>
      {/* Main cursor */}
      <div
        ref={cursorRef}
        className={cursorClasses}
      />
      
      {/* Cursor dot */}
      <div
        ref={dotRef}
        className={dotClasses}
      />
    </>
  );
};

export default CustomCursor; 