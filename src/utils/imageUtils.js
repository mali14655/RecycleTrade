/**
 * Image URL utilities for Cloudinary
 * Handles format transformation for browser compatibility and error handling
 */

/**
 * Transform Cloudinary URL to use automatic format
 * Automatically serves WebP to supported browsers, JPEG/PNG to others
 * Also applies quality optimization
 * 
 * @param {string} url - Original Cloudinary URL
 * @returns {string} - Transformed URL with format transformation
 */
export function getOptimizedImageUrl(url) {
  if (!url || typeof url !== 'string') {
    return url;
  }

  // Check if it's a Cloudinary URL
  if (!url.includes('res.cloudinary.com')) {
    return url; // Not a Cloudinary URL, return as-is
  }

  // Check if transformation already exists
  if (url.includes('/f_auto') || url.includes('/f_webp') || url.includes('/f_jpg')) {
    return url; // Already has format transformation
  }

  // Find the '/upload/' part in the URL
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) {
    return url; // Invalid Cloudinary URL format
  }

  // Insert transformation parameters after '/upload/'
  // Format: /upload/f_auto,q_auto/v1234567890/path/to/image.webp
  const beforeUpload = url.substring(0, uploadIndex + 8); // '/upload/'
  const afterUpload = url.substring(uploadIndex + 8);

  // Add format and quality transformations
  const transformation = 'f_auto,q_auto/';
  return beforeUpload + transformation + afterUpload;
}

/**
 * Get fallback image URL (placeholder)
 * @returns {string} - Placeholder image URL
 */
export function getFallbackImageUrl() {
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
}

/**
 * Handle image load error - try to convert WebP to JPEG format as fallback
 * @param {Event} event - Image error event
 * @param {string} originalUrl - Original image URL
 * @returns {boolean} - True if fallback was attempted
 */
export function handleImageError(event, originalUrl) {
  const img = event.target;
  
  // If already tried fallback, use placeholder
  if (img.dataset.fallbackAttempted === 'true') {
    img.src = getFallbackImageUrl();
    img.onerror = null; // Prevent infinite loop
    return true;
  }

  // Try to convert WebP to JPEG format
  if (originalUrl && originalUrl.includes('res.cloudinary.com')) {
    const uploadIndex = originalUrl.indexOf('/upload/');
    if (uploadIndex !== -1) {
      // Remove any existing format transformations and force JPEG
      let cleanUrl = originalUrl
        .replace(/\/f_(auto|webp|jpg|jpeg|png)\//g, '/')
        .replace(/\/f_(auto|webp|jpg|jpeg|png),/g, '/')
        .replace(/,f_(auto|webp|jpg|jpeg|png)/g, '');
      
      const beforeUpload = cleanUrl.substring(0, cleanUrl.indexOf('/upload/') + 8);
      const afterUpload = cleanUrl.substring(cleanUrl.indexOf('/upload/') + 8);
      
      // Force JPEG format as fallback
      const jpegUrl = beforeUpload + 'f_jpg,q_auto/' + afterUpload;
      
      img.dataset.fallbackAttempted = 'true';
      img.src = jpegUrl;
      return true;
    }
  }
  
  // Final fallback to placeholder
  img.src = getFallbackImageUrl();
  img.onerror = null; // Prevent infinite loop
  return true;
}

/**
 * Get image URL with specific format
 * 
 * @param {string} url - Original Cloudinary URL
 * @param {string} format - Desired format ('jpg', 'png', 'webp', 'auto')
 * @returns {string} - Transformed URL
 */
export function getImageUrlWithFormat(url, format = 'auto') {
  if (!url || typeof url !== 'string') {
    return url;
  }

  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  const formatParam = format === 'auto' ? 'f_auto' : `f_${format}`;
  const uploadIndex = url.indexOf('/upload/');
  
  if (uploadIndex === -1) {
    return url;
  }

  // Remove existing format transformation if any
  let cleanedUrl = url
    .replace(/\/f_(auto|webp|jpg|jpeg|png)\//g, '/')
    .replace(/\/f_(auto|webp|jpg|jpeg|png),/g, '/')
    .replace(/,f_(auto|webp|jpg|jpeg|png)/g, '');

  const beforeUpload = cleanedUrl.substring(0, cleanedUrl.indexOf('/upload/') + 8);
  const afterUpload = cleanedUrl.substring(cleanedUrl.indexOf('/upload/') + 8);

  const transformation = `${formatParam},q_auto/`;
  return beforeUpload + transformation + afterUpload;
}

/**
 * Get thumbnail/small version of image
 * 
 * @param {string} url - Original Cloudinary URL
 * @param {number} width - Desired width in pixels
 * @param {number} height - Desired height in pixels (optional)
 * @returns {string} - Transformed URL
 */
export function getThumbnailUrl(url, width = 200, height = null) {
  if (!url || typeof url !== 'string') {
    return url;
  }

  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) {
    return url;
  }

  const beforeUpload = url.substring(0, uploadIndex + 8);
  const afterUpload = url.substring(uploadIndex + 8);

  const sizeParam = height ? `w_${width},h_${height},c_fill` : `w_${width},c_scale`;
  const transformation = `${sizeParam},f_auto,q_auto/`;
  return beforeUpload + transformation + afterUpload;
}
