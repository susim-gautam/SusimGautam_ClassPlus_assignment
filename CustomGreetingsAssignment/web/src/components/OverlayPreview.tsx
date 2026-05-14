import React, { useRef } from 'react';
import { Template } from '../types';
import { useAuth } from '../context/AuthContext';
import { X, Share2, Download } from 'lucide-react';

const OverlayPreview: React.FC<{ template: Template, onClose: () => void }> = ({ template, onClose }) => {
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSharing, setIsSharing] = React.useState(false);

  const [mergedImage, setMergedImage] = React.useState<string | null>(null);

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    setMergedImage(null);
    
    const timeoutId = setTimeout(() => setIsSharing(false), 20000);

    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas not found');

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Context not found');

      // Load Background
      const bgImg = new Image();
      bgImg.crossOrigin = "anonymous";
      bgImg.src = template.imageUrl;
      
      await new Promise((resolve, reject) => {
        bgImg.onload = resolve;
        bgImg.onerror = () => reject(new Error('Background image failed to load. Check your internet or CORS.'));
      });
      
      canvas.width = bgImg.width;
      canvas.height = bgImg.height;
      ctx.drawImage(bgImg, 0, 0);

      // Draw Overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, 150);

      ctx.fillStyle = 'white';
      ctx.font = 'bold 60px Inter, Arial';
      ctx.textAlign = 'center';
      ctx.fillText(user?.name || 'Guest', canvas.width / 2 + 60, 90);

      if (user?.profilePic) {
        const pPic = new Image();
        pPic.crossOrigin = "anonymous"; // Added CORS for profile pic
        pPic.src = user.profilePic;
        try {
          await new Promise((resolve, reject) => {
            pPic.onload = resolve;
            pPic.onerror = () => reject(new Error('Profile pic failed to load'));
          });
          
          const size = 100;
          ctx.save();
          ctx.beginPath();
          ctx.arc(100, 75, 50, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(pPic, 50, 25, size, size);
          ctx.restore();
        } catch (e) {
          console.warn('Skipping profile pic due to load error');
        }
      }

      const dataUrl = canvas.toDataURL('image/png');
      setMergedImage(dataUrl); // Show preview

      if (navigator.share) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'greeting.png', { type: 'image/png' });
        
        try {
          await navigator.share({
            files: [file],
            title: 'Greeting from ' + (user?.name || 'Friend'),
            text: `Check out my personalized ${template.category} wish!`
          });
        } catch (err: any) {
          if (err.name !== 'AbortError') {
            // Fallback if file sharing fails
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'greeting.png';
            link.click();
          }
        }
      } else {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'greeting.png';
        link.click();
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      clearTimeout(timeoutId);
      setIsSharing(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', color: 'white' }}><X size={32} /></button>
      
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div className="preview-container" style={{ position: 'relative', width: '100%', maxWidth: '500px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        <img src={template.imageUrl} alt="Background" style={{ width: '100%', display: 'block' }} />
        
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '15px' }}>
          <img src={user?.profilePic || 'https://via.placeholder.com/50'} alt="P" style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid var(--primary)', objectFit: 'cover' }} />
          <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{user?.name}</h3>
        </div>
      </div>

      <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
        <button 
          onClick={handleShare} 
          disabled={isSharing}
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 30px', fontSize: '1.1rem' }}
        >
          <Share2 size={20} style={{ animation: isSharing ? 'spin 1s linear infinite' : 'none' }} />
          {isSharing ? 'Processing...' : 'Merge & Share'}
        </button>

        {mergedImage && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Merged Image Preview:</p>
            <img src={mergedImage} alt="Merged" style={{ width: '100%', maxWidth: '300px', border: '2px solid white', borderRadius: '8px' }} />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '5px' }}>Long-press image to save if share fails</p>
          </div>
        )}
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default OverlayPreview;
