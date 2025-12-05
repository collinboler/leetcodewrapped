import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

function ShareButton({ username, avatar, inline = false }) {
  const handleShare = async () => {
    const slideElement = document.querySelector('.slide');
    if (!slideElement) return;

    try {
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      }
      if (document.activeElement) {
        document.activeElement.blur();
      }

      const shareBtn = document.querySelector('.share-button-container');
      const navButtons = document.querySelector('.nav-buttons');
      const indicators = document.querySelector('.slide-indicator');
      const header = document.querySelector('.wrapped-header');
      if (shareBtn) shareBtn.style.visibility = 'hidden';
      if (navButtons) navButtons.style.visibility = 'hidden';
      if (indicators) indicators.style.visibility = 'hidden';
      if (header) header.style.visibility = 'hidden';

      // Pre-convert external images to data URLs to avoid CORS issues
      const externalImages = slideElement.querySelectorAll('img[src^="http"]');
      const convertedImages = [];
      
      for (const img of externalImages) {
        const originalSrc = img.src;
        img.setAttribute('data-original-src', originalSrc);
        
        try {
          // Try fetching with CORS
          const response = await fetch(originalSrc, { 
            mode: 'cors',
            headers: { 'Accept': 'image/*' }
          });
          const blob = await response.blob();
          const dataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
          });
          if (dataUrl) {
            img.src = dataUrl;
            convertedImages.push(img);
            continue;
          }
        } catch (e) {
          // CORS fetch failed, continue to fallback
        }
        
        // Fallback: create a colored placeholder based on language
        const langName = img.alt?.toLowerCase() || '';
        const langColors = {
          'java': '#ED8B00',
          'python': '#3776AB',
          'javascript': '#F7DF1E',
          'typescript': '#3178C6',
          'c++': '#00599C',
          'c': '#A8B9CC',
          'go': '#00ADD8',
          'rust': '#DEA584',
          'mysql': '#4479A1',
          'bash': '#4EAA25',
        };
        const color = langColors[langName] || '#888';
        
        // Create a simple colored square as placeholder
        const size = img.width || img.height || 32;
        const placeholderCanvas = document.createElement('canvas');
        placeholderCanvas.width = size;
        placeholderCanvas.height = size;
        const pCtx = placeholderCanvas.getContext('2d');
        pCtx.fillStyle = color;
        pCtx.beginPath();
        pCtx.roundRect(0, 0, size, size, size * 0.2);
        pCtx.fill();
        
        // Add first letter
        pCtx.fillStyle = '#fff';
        pCtx.font = `bold ${size * 0.5}px system-ui`;
        pCtx.textAlign = 'center';
        pCtx.textBaseline = 'middle';
        const letter = langName.charAt(0).toUpperCase() || '?';
        pCtx.fillText(letter, size/2, size/2);
        
        img.src = placeholderCanvas.toDataURL('image/png');
        convertedImages.push(img);
      }

      const canvas = await html2canvas(slideElement, {
        backgroundColor: '#0A0A0A',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        onclone: (clonedDoc) => {
          const style = clonedDoc.createElement('style');
          style.textContent = `
            *, *::before, *::after {
              -webkit-user-select: none !important;
              user-select: none !important;
            }
            ::selection, ::-moz-selection {
              background: transparent !important;
              color: inherit !important;
            }
            *:focus { outline: none !important; box-shadow: none !important; }
          `;
          clonedDoc.head.appendChild(style);
          
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach(el => {
            const computedStyle = window.getComputedStyle(el);
            if (computedStyle.webkitBackgroundClip === 'text' || computedStyle.backgroundClip === 'text') {
              let color = '#40C4A9';
              const bg = computedStyle.background || computedStyle.backgroundImage || '';
              if (bg.includes('ffa116') || bg.includes('FFA116') || bg.includes('ff6b35')) color = '#FFA116';
              if (bg.includes('ffd700') || bg.includes('FFD700') || bg.includes('ffa500')) color = '#FFD700';
              if (bg.includes('fa709a') || bg.includes('fee140')) color = '#fa709a';
              if (bg.includes('ff6b6b') || bg.includes('FF6B6B')) color = '#FF6B6B';
              
              el.style.background = 'none';
              el.style.backgroundColor = 'transparent';
              el.style.webkitBackgroundClip = 'unset';
              el.style.backgroundClip = 'unset';
              el.style.webkitTextFillColor = color;
              el.style.color = color;
            }
          });
        }
      });

      // Restore original image sources
      convertedImages.forEach((img) => {
        const originalSrc = img.getAttribute('data-original-src');
        if (originalSrc) {
          img.src = originalSrc;
          img.removeAttribute('data-original-src');
        }
      });

      const finalCanvas = document.createElement('canvas');
      const ctx = finalCanvas.getContext('2d');
      
      // Always use mobile layout (portrait style)
      finalCanvas.width = canvas.width;
      finalCanvas.height = canvas.height;
      ctx.drawImage(canvas, 0, 0);

      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      await new Promise((resolve) => {
        logoImg.onload = resolve;
        logoImg.onerror = resolve;
        logoImg.src = '/leetcodewrapped.png';
      });

      // Always use mobile-style layout
      // leetcode wrapped 2025 text centered at top - with colors
      const centerX = finalCanvas.width / 2;
      ctx.textAlign = 'left';
      
      // Measure text parts
      ctx.font = 'bold 56px system-ui, -apple-system, sans-serif';
      const leetWidth = ctx.measureText('leet').width;
      const codeWidth = ctx.measureText('code').width;
      const spaceWidth = ctx.measureText(' ').width;
      ctx.font = 'italic bold 56px system-ui, -apple-system, sans-serif';
      const wrappedWidth = ctx.measureText('wrapped').width;
      ctx.font = 'bold 56px system-ui, -apple-system, sans-serif';
      const yearWidth = ctx.measureText(' 2025').width;
      const textTotalWidth = leetWidth + codeWidth + spaceWidth + wrappedWidth + yearWidth;
      const startX = centerX - textTotalWidth / 2;
      
      let currentX = startX;
      ctx.font = 'bold 56px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#fea216';
      ctx.fillText('leet', currentX, 70);
      currentX += leetWidth;
      
      ctx.fillStyle = '#b3b3b3';
      ctx.fillText('code', currentX, 70);
      currentX += codeWidth + spaceWidth;
      
      ctx.font = 'italic bold 56px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#f32426';
      ctx.fillText('wrapped', currentX, 70);
      currentX += wrappedWidth;
      
      ctx.font = 'bold 56px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText(' 2025', currentX, 70);

      // Big logo below text
      const logoSize = 180;
      if (logoImg.complete && logoImg.naturalWidth > 0) {
        ctx.drawImage(logoImg, (finalCanvas.width - logoSize) / 2, 95, logoSize, logoSize);
      }

      // Profile pic and username on same line - centered
      const profileSize = 50;
      const usernameText = `u/${username}`;
      ctx.font = 'bold 44px system-ui';
      const usernameWidth = ctx.measureText(usernameText).width;
      const bottomTotalWidth = profileSize + 15 + usernameWidth;
      const profileStartX = (finalCanvas.width - bottomTotalWidth) / 2;
      const profileY = finalCanvas.height - 130;
      
      if (avatar) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = avatar;
          });
          
          ctx.save();
          ctx.beginPath();
          ctx.arc(profileStartX + profileSize/2, profileY + profileSize/2, profileSize/2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, profileStartX, profileY, profileSize, profileSize);
          ctx.restore();
        } catch (e) {
          drawInitialCircle(ctx, profileStartX, profileY, profileSize, username);
        }
      } else {
        drawInitialCircle(ctx, profileStartX, profileY, profileSize, username);
      }

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 44px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText(usernameText, profileStartX + profileSize + 15, profileY + profileSize/2 + 15);

      // leetcodewrapped.com with colored text
      ctx.font = 'bold 44px system-ui';
      ctx.textAlign = 'left';
      const leetW = ctx.measureText('leet').width;
      const codeW = ctx.measureText('code').width;
      ctx.font = 'italic bold 44px system-ui';
      const wrappedW = ctx.measureText('wrapped').width;
      ctx.font = 'bold 44px system-ui';
      const dotComW = ctx.measureText('.com').width;
      const linkTotalWidth = leetW + codeW + wrappedW + dotComW;
      const linkStartX = (finalCanvas.width - linkTotalWidth) / 2;
      
      let linkX = linkStartX;
      ctx.fillStyle = '#fea216';
      ctx.fillText('leet', linkX, finalCanvas.height - 45);
      linkX += leetW;
      
      ctx.fillStyle = '#b3b3b3';
      ctx.fillText('code', linkX, finalCanvas.height - 45);
      linkX += codeW;
      
      ctx.font = 'italic bold 44px system-ui';
      ctx.fillStyle = '#f32426';
      ctx.fillText('wrapped', linkX, finalCanvas.height - 45);
      linkX += wrappedW;
      
      ctx.font = 'bold 44px system-ui';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillText('.com', linkX, finalCanvas.height - 45);

      if (shareBtn) shareBtn.style.visibility = 'visible';
      if (navButtons) navButtons.style.visibility = 'visible';
      if (indicators) indicators.style.visibility = 'visible';
      if (header) header.style.visibility = 'visible';

      finalCanvas.toBlob(async (blob) => {
        const file = new File([blob], `leetcode-wrapped-${username}.png`, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: 'leetcode wrapped 2025' });
            return;
          } catch (err) {}
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leetcode-wrapped-${username}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/png');

    } catch (err) {
      console.error('Screenshot failed:', err);
      const shareBtn = document.querySelector('.share-button-container');
      const navButtons = document.querySelector('.nav-buttons');
      const indicators = document.querySelector('.slide-indicator');
      const header = document.querySelector('.wrapped-header');
      if (shareBtn) shareBtn.style.visibility = 'visible';
      if (navButtons) navButtons.style.visibility = 'visible';
      if (indicators) indicators.style.visibility = 'visible';
      if (header) header.style.visibility = 'visible';
    }
  };

  function drawInitialCircle(ctx, x, y, size, name) {
    ctx.fillStyle = '#FFA116';
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.font = `bold ${Math.floor(size * 0.5)}px system-ui`;
    ctx.textAlign = 'center';
    ctx.fillText(name.charAt(0).toUpperCase(), x + size/2, y + size/2 + size * 0.18);
  }

  return (
    <motion.div
      className="share-button-container"
      style={{
        position: inline ? 'relative' : 'absolute',
        bottom: inline ? 'auto' : '100px',
        left: inline ? 'auto' : 0,
        right: inline ? 'auto' : 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: inline ? 'auto' : 'none',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: inline ? 0 : 1.5 }}
    >
      <button
        onClick={handleShare}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          borderRadius: '20px',
          padding: '0.5rem 1.2rem',
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '0.75rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          transition: 'all 0.2s ease',
          pointerEvents: 'auto',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          e.target.style.transform = 'scale(1)';
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
        </svg>
        Share
      </button>
    </motion.div>
  );
}

export default ShareButton;
