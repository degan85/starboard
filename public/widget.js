/**
 * starboard Widget - 고객 후기 임베드 스크립트
 * 
 * 사용법:
 * <div id="starboard-widget" data-slug="your-project-slug"></div>
 * <script src="https://starboard.app/widget.js"></script>
 */

(function() {
  'use strict';

  const WIDGET_ID = 'starboard-widget';
  const API_BASE = window.starboard_API_BASE || (document.currentScript?.src.replace('/widget.js', '') || '');

  // 스타일 주입
  function injectStyles() {
    if (document.getElementById('starboard-styles')) return;

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
      .starboard-card {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 1.5rem;
        transition: box-shadow 0.2s;
      }
      .starboard-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      .starboard-stars {
        display: flex;
        gap: 2px;
        margin-bottom: 0.75rem;
      }
      .starboard-star {
        width: 18px;
        height: 18px;
        fill: #facc15;
        color: #facc15;
      }
      .starboard-content {
        color: #374151;
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
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 1rem;
      }
      .starboard-name {
        font-weight: 600;
        color: #111827;
      }
      .starboard-role {
        font-size: 0.85rem;
        color: #6b7280;
      }
      .starboard-powered {
        text-align: center;
        margin-top: 1.5rem;
        font-size: 0.75rem;
        color: #9ca3af;
      }
      .starboard-powered a {
        color: #6366f1;
        text-decoration: none;
      }
      .starboard-powered a:hover {
        text-decoration: underline;
      }
      .starboard-empty {
        text-align: center;
        padding: 2rem;
        color: #6b7280;
      }
      .starboard-loading {
        text-align: center;
        padding: 2rem;
        color: #6b7280;
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.id = 'starboard-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  // 별점 SVG 생성
  function createStars(rating) {
    let stars = '';
    for (let i = 0; i < rating; i++) {
      stars += `<svg class="starboard-star" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>`;
    }
    return stars;
  }

  // 후기 카드 생성
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

  // HTML 이스케이프
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // 위젯 렌더링
  async function renderWidget(container) {
    const slug = container.dataset.slug;
    
    if (!slug) {
      container.innerHTML = '<div class="starboard-empty">❌ data-slug 속성이 필요합니다.</div>';
      return;
    }

    container.innerHTML = '<div class="starboard-loading">⏳ 후기를 불러오는 중...</div>';

    try {
      const response = await fetch(`${API_BASE}/api/testimonials?slug=${encodeURIComponent(slug)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }

      const data = await response.json();
      const testimonials = data.testimonials || [];

      if (testimonials.length === 0) {
        container.innerHTML = '<div class="starboard-empty">아직 후기가 없습니다. 😢</div>';
        return;
      }

      const cards = testimonials.map(createCard).join('');
      
      container.innerHTML = `
        <div class="starboard-container">
          <div class="starboard-grid">${cards}</div>
          <div class="starboard-powered">
            Powered by <a href="https://starboard.app" target="_blank" rel="noopener">starboard</a> 💜
          </div>
        </div>
      `;
    } catch (error) {
      console.error('starboard Widget Error:', error);
      container.innerHTML = '<div class="starboard-empty">⚠️ 후기를 불러올 수 없습니다.</div>';
    }
  }

  // 초기화
  function init() {
    injectStyles();

    const containers = document.querySelectorAll(`#${WIDGET_ID}, [data-starboard]`);
    containers.forEach(renderWidget);
  }

  // DOM 준비되면 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 전역 API 노출 (수동 초기화용)
  window.starboard = {
    init: init,
    render: renderWidget,
  };
})();
