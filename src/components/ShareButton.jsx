import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

function ShareButton({ username, avatar }) {
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
      // LeetCode Wrapped 2025 text centered at top
      ctx.fillStyle = '#FFA116';
      ctx.font = 'bold 56px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('LeetCode Wrapped 2025', finalCanvas.width / 2, 70);

      // Big logo below text
      const logoSize = 150;
      if (logoImg.complete && logoImg.naturalWidth > 0) {
        ctx.drawImage(logoImg, (finalCanvas.width - logoSize) / 2, 95, logoSize, logoSize);
      }

      // Profile pic and username on same line - centered
      const profileSize = 50;
      const usernameText = `@${username}`;
      ctx.font = 'bold 44px system-ui';
      const usernameWidth = ctx.measureText(usernameText).width;
      const totalWidth = profileSize + 15 + usernameWidth;
      const startX = (finalCanvas.width - totalWidth) / 2;
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
          ctx.arc(startX + profileSize/2, profileY + profileSize/2, profileSize/2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, startX, profileY, profileSize, profileSize);
          ctx.restore();
          
          ctx.strokeStyle = '#FFA116';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(startX + profileSize/2, profileY + profileSize/2, profileSize/2, 0, Math.PI * 2);
          ctx.stroke();
        } catch (e) {
          drawInitialCircle(ctx, startX, profileY, profileSize, username);
        }
      } else {
        drawInitialCircle(ctx, startX, profileY, profileSize, username);
      }

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 44px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText(usernameText, startX + profileSize + 15, profileY + profileSize/2 + 15);

      ctx.fillStyle = '#FFA116';
      ctx.font = 'bold 44px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('leetcodewrapped.com', finalCanvas.width / 2, finalCanvas.height - 45);

      if (shareBtn) shareBtn.style.visibility = 'visible';
      if (navButtons) navButtons.style.visibility = 'visible';
      if (indicators) indicators.style.visibility = 'visible';
      if (header) header.style.visibility = 'visible';

      finalCanvas.toBlob(async (blob) => {
        const file = new File([blob], `leetcode-wrapped-${username}.png`, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: 'LeetCode Wrapped 2025' });
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
        position: 'absolute',
        bottom: '100px',
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5 }}
    >
      <button
        onClick={handleShare}
        style={{
          background: 'rgba(255, 161, 22, 0.15)',
          border: '1px solid rgba(255, 161, 22, 0.3)',
          borderRadius: '24px',
          padding: '0.6rem 1.5rem',
          color: '#FFA116',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'all 0.2s ease',
          pointerEvents: 'auto',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255, 161, 22, 0.25)';
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255, 161, 22, 0.15)';
          e.target.style.transform = 'scale(1)';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
        </svg>
        Share
      </button>
    </motion.div>
  );
}

export default ShareButton;
