/**
 * starboard Widget - Customer Testimonials Embed Script
 * 
 * Usage:
 * <div id="starboard-widget" data-slug="your-project-slug"></div>
 * <script src="https://starboard.app/widget.js"></script>
 */

(function() {
  'use strict';

  const WIDGET_ID = 'starboard-widget';
  const API_BASE = window.starboard_API_BASE || (document.currentScript?.src.replace('/widget.js', '') || '');

  // Inject styles
  function injectStyles(primaryColor = '#6366f1', theme = 'LIGHT') {
    const existingStyles = document.getElementById('starboard-styles');
    if (existingStyles) existingStyles.remove();

    const isDark = theme === 'DARK' || (theme === 'AUTO' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    const styles = `
      .starboard-container {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        max-width: 100%;
      }
      .starboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
      }
      .starboard-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .starboard-carousel {
        display: flex;
        gap: 1rem;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 1rem;
      }
      .starboard-carousel .starboard-card {
        min-width: 300px;
        scroll-snap-align: start;
      }
      .starboard-card {
        background: ${isDark ? '#1f2937' : '#ffffff'};
        border: 1px solid ${isDark ? '#374151' : '#e5e7eb'};
        border-radius: 12px;
        padding: 1.5rem;
        transition: box-shadow 0.2s;
      }
      .starboard-card:hover {
        box-shadow: 0 4px 12px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'};
      }
      .starboard-stars {
        display: flex;
        gap: 2px;
        margin-bottom: 0.75rem;
      }
      .starboard-star {
        width: 18px;
        height: 18px;
        fill: ${primaryColor};
        color: ${primaryColor};
      }
      .starboard-content {
        color: ${isDark ? '#d1d5db' : '#374151'};
        font-size: 0.95rem;
        line-height: 1.6;
        margin-bottom: 1rem;
      }
      .starboard-author {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .starboard-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, ${primaryColor}, ${adjustColor(primaryColor, 30)});
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 1rem;
      }
      .starboard-name {
        font-weight: 600;
        color: ${isDark ? '#f3f4f6' : '#111827'};
      }
      .starboard-role {
        font-size: 0.85rem;
        color: ${isDark ? '#9ca3af' : '#6b7280'};
      }
      .starboard-powered {
        text-align: center;
        margin-top: 1.5rem;
        font-size: 0.75rem;
        color: ${isDark ? '#6b7280' : '#9ca3af'};
      }
      .starboard-powered a {
        color: ${primaryColor};
        text-decoration: none;
      }
      .starboard-powered a:hover {
        text-decoration: underline;
      }
      .starboard-empty {
        text-align: center;
        padding: 2rem;
        color: ${isDark ? '#9ca3af' : '#6b7280'};
      }
      .starboard-loading {
        text-align: center;
        padding: 2rem;
        color: ${isDark ? '#9ca3af' : '#6b7280'};
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.id = 'starboard-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  // Adjust color brightness
  function adjustColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
  }

  // Create stars SVG
  function createStars(rating, color) {
    let stars = '';
    for (let i = 0; i < rating; i++) {
      stars += `<svg class="starboard-star" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>`;
    }
    return stars;
  }

  // Create testimonial card
  function createCard(testimonial) {
    const initial = testimonial.name.charAt(0).toUpperCase();
    const role = [testimonial.role, testimonial.company].filter(Boolean).join(' @ ');

    return `
      <div class="starboard-card">
        <div class="starboard-stars">${createStars(testimonial.rating)}</div>
        <p class="starboard-content">${escapeHtml(testimonial.content)}</p>
        <div class="starboard-author">
          <div class="starboard-avatar">${initial}</div>
          <div>
            <div class="starboard-name">${escapeHtml(testimonial.name)}</div>
            ${role ? `<div class="starboard-role">${escapeHtml(role)}</div>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // Escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Get layout class
  function getLayoutClass(layout) {
    switch (layout) {
      case 'LIST': return 'starboard-list';
      case 'CAROUSEL': return 'starboard-carousel';
      default: return 'starboard-grid';
    }
  }

  // Render widget
  async function renderWidget(container) {
    const slug = container.dataset.slug;
    
    if (!slug) {
      container.innerHTML = '<div class="starboard-empty">❌ data-slug attribute required.</div>';
      return;
    }

    container.innerHTML = '<div class="starboard-loading">⏳ Loading testimonials...</div>';

    try {
      const response = await fetch(`${API_BASE}/api/testimonials?slug=${encodeURIComponent(slug)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }

      const data = await response.json();
      const testimonials = data.testimonials || [];
      const project = data.project || {};
      
      // Apply theme
      const primaryColor = project.primaryColor || '#6366f1';
      const theme = project.widgetTheme || 'LIGHT';
      const layout = project.widgetLayout || 'GRID';
      
      injectStyles(primaryColor, theme);

      if (testimonials.length === 0) {
        container.innerHTML = '<div class="starboard-empty">No testimonials yet. 😢</div>';
        return;
      }

      const cards = testimonials.map(createCard).join('');
      const layoutClass = getLayoutClass(layout);
      
      container.innerHTML = `
        <div class="starboard-container">
          <div class="${layoutClass}">${cards}</div>
          <div class="starboard-powered">
            Powered by <a href="https://starboard.app" target="_blank" rel="noopener">starboard</a> 💜
          </div>
        </div>
      `;
    } catch (error) {
      console.error('starboard Widget Error:', error);
      container.innerHTML = '<div class="starboard-empty">⚠️ Could not load testimonials.</div>';
    }
  }

  // Initialize
  function init() {
    const containers = document.querySelectorAll(`#${WIDGET_ID}, [data-starboard]`);
    containers.forEach(renderWidget);
  }

  // Run when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global API
  window.starboard = {
    init: init,
    render: renderWidget,
  };
})();
