import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/client';
import { Template } from '../types';
import { Crown, Share2, Filter, LogOut } from 'lucide-react';
import OverlayPreview from '../components/OverlayPreview';
import PremiumModal from '../components/PremiumModal';

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchTemplates = async () => {
      const res = await API.get('/templates');
      setTemplates(res.data);
    };
    fetchTemplates();
  }, []);

  const categories = ['All', ...new Set(templates.map(t => t.category))];

  const filteredTemplates = activeCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  const handleTemplateClick = (t: Template) => {
    if (t.isPremium && !user?.isPremium) {
      setShowPremiumModal(true);
    } else {
      setSelectedTemplate(t);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1>Greetings AI</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="glass-card" style={{ padding: '5px 15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={user?.profilePic || 'https://via.placeholder.com/40'} alt="P" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
            <span style={{ fontSize: '0.9rem' }}>{user?.isPremium ? 'Premium' : 'Free Plan'}</span>
            {!user?.isPremium && <Crown size={14} color="#fbbf24" />}
          </div>
          <button onClick={logout} style={{ padding: '8px', background: 'rgba(255,0,0,0.1)', color: '#ff4444' }}><LogOut size={18} /></button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
        {categories.map(c => (
          <button 
            key={c}
            onClick={() => setActiveCategory(c)}
            style={{ 
              padding: '8px 20px', 
              background: activeCategory === c ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              borderRadius: '20px',
              border: activeCategory === c ? 'none' : '1px solid var(--glass-border)',
              color: 'white',
              whiteSpace: 'nowrap'
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filteredTemplates.map(t => (
          <div 
            key={t._id} 
            className="glass-card" 
            style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
            onClick={() => handleTemplateClick(t)}
          >
            <img src={t.imageUrl} alt={t.title} style={{ width: '100%', height: '350px', objectFit: 'cover' }} />
            {t.isPremium && (
              <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                <span className="premium-badge">Premium</span>
              </div>
            )}
            <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: '600' }}>{t.title}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.category}</p>
              </div>
              <Share2 size={18} color="var(--text-muted)" />
            </div>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <OverlayPreview 
          template={selectedTemplate} 
          onClose={() => setSelectedTemplate(null)} 
        />
      )}

      {showPremiumModal && (
        <PremiumModal onClose={() => setShowPremiumModal(false)} />
      )}
    </div>
  );
};

export default HomePage;
