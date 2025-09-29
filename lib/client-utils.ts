/**
 * Utility functions to handle client-side rendering and browser compatibility
 */

/**
 * Check if we're running on the client side
 */
export const isClient = typeof window !== 'undefined'

/**
 * Check if clipboard API is supported
 */
export const isClipboardSupported = () => {
  return isClient && 'clipboard' in navigator && 'writeText' in navigator.clipboard
}

/**
 * Safe clipboard write with fallback
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!isClient) return false
  
  try {
    if (isClipboardSupported()) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      try {
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        return successful
      } catch (err) {
        document.body.removeChild(textArea)
        return false
      }
    }
  } catch (err) {
    console.warn('Copy to clipboard failed:', err)
    return false
  }
}

/**
 * Remove browser extension attributes from elements
 */
export const cleanBrowserExtensionAttributes = () => {
  if (!isClient) return
  
  // Remove common browser extension attributes
  const attributesToRemove = [
    'bis_skin_checked',
    'bis_register',
    '__processed_c56d2dc9-9b3f-475c-ac8e-26999fcb1776__'
  ]
  
  attributesToRemove.forEach(attr => {
    const elements = document.querySelectorAll(`[${attr}]`)
    elements.forEach(element => {
      element.removeAttribute(attr)
    })
  })
}

/**
 * Safe window access with fallback
 */
export const safeWindowAccess = <T>(callback: () => T, fallback: T): T => {
  if (!isClient) return fallback
  try {
    return callback()
  } catch (error) {
    console.warn('Window access failed:', error)
    return fallback
  }
}

/**
 * Safe document access with fallback
 */
export const safeDocumentAccess = <T>(callback: () => T, fallback: T): T => {
  if (!isClient) return fallback
  try {
    return callback()
  } catch (error) {
    console.warn('Document access failed:', error)
    return fallback
  }
}
