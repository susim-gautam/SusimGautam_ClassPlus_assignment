import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, Save } from 'lucide-react';

const ProfileSetup: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [preview, setPreview] = useState(user?.profilePic || '');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile(name, preview);
      onComplete();
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>Set up your profile</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>This will be used for your personalized cards</p>
      
      <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 30px' }}>
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--glass-border)', overflow: 'hidden', border: '3px solid var(--primary)' }}>
          {preview ? (
            <img src={preview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <Camera size={40} />
            </div>
          )}
        </div>
        <label style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--primary)', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
          <Camera size={18} />
          <input type="file" onChange={handleImageChange} hidden accept="image/*" />
        </label>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '300px', margin: '0 auto' }}>
        <input 
          type="text" 
          placeholder="Your Full Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          style={{ textAlign: 'center' }}
        />
        <button onClick={handleSave} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Save size={18} />
          Save & Continue
        </button>
      </div>
    </div>
  );
};

export default ProfileSetup;
