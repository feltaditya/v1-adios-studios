/**
 * Global error handler to suppress browser extension and clipboard errors
 * This prevents console errors from browser extensions that don't affect functionality
 */

// Only run on client side
if (typeof window !== 'undefined') {
  // Suppress clipboard errors from browser extensions
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const message = args[0]?.toString() || '';
    
    // Suppress common browser extension errors
    if (
      message.includes('Copy to clipboard is not supported') ||
      message.includes('clipboard') ||
      message.includes('bis_skin_checked') ||
      message.includes('bis_register') ||
      message.includes('__processed_') ||
      message.includes('browser extension') ||
      message.includes('extension')
    ) {
      return; // Suppress these errors
    }
    
    // Log other errors normally
    originalConsoleError.apply(console, args);
  };

  // Suppress unhandled promise rejections from browser extensions
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.toString() || '';
    
    if (
      reason.includes('clipboard') ||
      reason.includes('Copy to clipboard is not supported') ||
      reason.includes('browser extension')
    ) {
      event.preventDefault(); // Suppress these errors
      return;
    }
  });

  // Clean browser extension attributes on DOM mutations
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes') {
        const target = mutation.target as Element;
        const attributesToRemove = [
          'bis_skin_checked',
          'bis_register',
          '__processed_c56d2dc9-9b3f-475c-ac8e-26999fcb1776__'
        ];
        
        attributesToRemove.forEach(attr => {
          if (target.hasAttribute(attr)) {
            target.removeAttribute(attr);
          }
        });
      }
    });
  });
  
  // Start observing when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ['bis_skin_checked', 'bis_register', '__processed_c56d2dc9-9b3f-475c-ac8e-26999fcb1776__']
      });
    });
  } else {
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['bis_skin_checked', 'bis_register', '__processed_c56d2dc9-9b3f-475c-ac8e-26999fcb1776__']
    });
  }
}
