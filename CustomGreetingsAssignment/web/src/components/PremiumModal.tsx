import React from 'react';
import { X, Crown, Check } from 'lucide-react';

const PremiumModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%', padding: '40px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', color: 'var(--text-muted)' }}><X size={24} /></button>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Crown size={30} color="black" />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Unlock Premium Designs</h2>
          <p style={{ color: 'var(--text-muted)' }}>Get access to exclusive templates and high-quality exports.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
          {['Unlimited Access', 'High Resolution Exports', 'Ad-free Experience', 'New Weekly Templates'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '4px', borderRadius: '50%' }}>
                <Check size={14} color="var(--primary)" />
              </div>
              <span>{f}</span>
            </div>
          ))}
        </div>

        <button className="btn-primary" style={{ width: '100%', padding: '15px', fontSize: '1.1rem', fontWeight: '600' }}>
          Upgrade for $4.99/mo
        </button>
        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '15px' }}>Cancel anytime. Secure checkout.</p>
      </div>
    </div>
  );
};

export default PremiumModal;
