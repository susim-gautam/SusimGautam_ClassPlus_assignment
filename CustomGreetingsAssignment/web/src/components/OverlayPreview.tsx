import React, { useRef } from 'react';
import { Template } from '../types';
import { useAuth } from '../context/AuthContext';
import { X, Share2, Download } from 'lucide-react';

const OverlayPreview: React.FC<{ template: Template, onClose: () => void }> = ({ template, onClose }) => {
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load Background
    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.src = template.imageUrl;
    
    await new Promise((resolve) => (bgImg.onload = resolve));
    
    canvas.width = bgImg.width;
    canvas.height = bgImg.height;
    ctx.drawImage(bgImg, 0, 0);

    // Draw Overlay Background (Top Bar)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, 150);

    // Draw User Name
    ctx.fillStyle = 'white';
    ctx.font = 'bold 60px Inter, Arial';
    ctx.textAlign = 'center';
    ctx.fillText(user?.name || 'Guest', canvas.width / 2 + 60, 90);

    // Draw Profile Picture (Circular)
    if (user?.profilePic) {
      const pPic = new Image();
      pPic.src = user.profilePic;
      await new Promise((resolve) => (pPic.onload = resolve));
      
      const size = 100;
      const x = 50;
      const y = 25;
      
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(pPic, x, y, size, size);
      ctx.restore();
      
      // Border
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Export & Share
    const dataUrl = canvas.toDataURL('image/png');
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], 'greeting.png', { type: 'image/png' });

    if (navigator.share) {
      try {
        await navigator.share({
          files: [file],
          title: 'Custom Greeting',
          text: `Check out my personalized ${template.category} wish!`
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'greeting.png';
      link.click();
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', color: 'white' }}><X size={32} /></button>
      
      <div className="preview-container" style={{ position: 'relative', width: '100%', maxWidth: '500px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        <img src={template.imageUrl} alt="Background" style={{ width: '100%', display: 'block' }} />
        
        {/* CSS Overlay for Live Preview */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '15px' }}>
          <img src={user?.profilePic || 'https://via.placeholder.com/50'} alt="P" style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid var(--primary)', objectFit: 'cover' }} />
          <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{user?.name}</h3>
        </div>
      </div>

      <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
        <button onClick={handleShare} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 30px', fontSize: '1.1rem' }}>
          <Share2 size={20} />
          Merge & Share
        </button>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default OverlayPreview;
