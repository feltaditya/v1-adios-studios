# 3D Scroll Effect Fix Plan

## Current Issues

1. The current implementation is not a true scroll-based 3D effect
2. It uses static transforms that are applied when cards enter the viewport
3. There's no dynamic response to scroll position changes
4. The effect lacks smoothness and natural movement

## Solution Overview

We need to implement a proper scroll-based 3D effect that:
1. Dynamically changes 3D transforms based on scroll position
2. Responds to the user's scrolling behavior in real-time
3. Provides smooth transitions and natural movement
4. Works well across different screen sizes

## Implementation Steps

### 1. Update JavaScript Logic (app/page.tsx)

Replace the current IntersectionObserver implementation with a scroll-based approach:

```javascript
// 3D Service Card Scroll Animation
useEffect(() => {
  const handleScroll = () => {
    const servicesSection = document.querySelector('.services-section');
    if (!servicesSection) return;
    
    const sectionRect = servicesSection.getBoundingClientRect();
    const sectionTop = sectionRect.top;
    const sectionBottom = sectionRect.bottom;
    const windowHeight = window.innerHeight;
    
    // Only apply 3D effect when section is in view
    if (sectionTop < windowHeight * 0.75 && sectionBottom > windowHeight * 0.25) {
      const scrollProgress = (windowHeight * 0.75 - sectionTop) / (windowHeight * 0.5);
      const cards = servicesSection.querySelectorAll('.service-card');
      
      cards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const cardTop = cardRect.top;
        const cardBottom = cardRect.bottom;
        const cardCenter = (cardTop + cardBottom) / 2;
        const windowCenter = windowHeight / 2;
        
        // Calculate distance from center of window
        const distanceFromCenter = Math.abs(cardCenter - windowCenter);
        const maxDistance = windowHeight / 2;
        const distanceRatio = Math.min(distanceFromCenter / maxDistance, 1);
        
        // Calculate rotation based on scroll position and distance from center
        const rotationX = (scrollProgress * 10) - (distanceRatio * 30);
        const rotationY = (scrollProgress * 5) - (distanceRatio * 15);
        const translateZ = -100 + (scrollProgress * 50) - (distanceRatio * 50);
        
        // Apply transforms with smooth transitions
        (card as HTMLElement).style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg) translateZ(${translateZ}px)`;
      });
    }
  };

  // Initial call to set correct transforms
  handleScroll();
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);
```

### 2. Update CSS Styles (app/globals.css)

Modify the CSS to support the new scroll-based effect:

```css
/* 3D Service Card Animations */
.perspective-1000 {
  perspective: 1000px;
}

.transform-style-preserve-3d {
  transform-style: preserve-3d;
}

.service-card {
  /* Remove static transforms and add transition for smooth scrolling effect */
  transition: transform 0.1s ease-out;
  will-change: transform;
}

/* Remove the old static transforms that were applied on scroll */
.service-card.animate-in {
  /* This class is no longer needed with the new scroll-based approach */
  transform: none;
}

/* Remove the nth-child specific transforms */
.service-card:nth-child(1),
.service-card:nth-child(2),
.service-card:nth-child(3),
.service-card:nth-child(4) {
  /* These static transforms are replaced by dynamic scroll-based transforms */
  transform: none;
}
```

## Benefits of This Approach

1. **True Scroll-Based Effect**: The 3D transforms change dynamically as the user scrolls
2. **Performance Optimized**: Uses passive event listeners and will-change property
3. **Natural Movement**: Cards respond to both scroll position and their position relative to the viewport center
4. **Smooth Transitions**: CSS transitions ensure smooth animation
5. **Responsive**: Works well on different screen sizes

## Testing Plan

1. Test the effect on different screen sizes (mobile, tablet, desktop)
2. Verify performance is smooth with no jank
3. Ensure the effect activates only when the section is in view
4. Check that the transforms feel natural and not exaggerated
5. Test on different browsers for compatibility

## Next Steps

To implement this solution:
1. Switch to Code mode to make the actual code changes
2. Update the JavaScript logic in app/page.tsx
3. Update the CSS in app/globals.css
4. Test the implementation across different devices and browsers