import { GoogleLogin } from '@react-oauth/google';
import { Mail, UserCircle, LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, guestLogin, googleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleGoogleSuccess = (credentialResponse: any) => {
    // In a real app, you'd decode the JWT or send it to your server for verification
    // For this assignment, we'll mock the extraction
    googleLogin({
      name: 'Google User',
      email: 'user@google.com',
      profilePic: 'https://lh3.googleusercontent.com/a/default-user'
    });
  };

  return (
    <div className="login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '20px' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <h2 style={{ marginBottom: '10px', textAlign: 'center' }}>{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '30px' }}>Custom Greetings & Wishes</p>
        
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin 
            onSuccess={handleGoogleSuccess} 
            onError={() => alert('Google Login Failed')} 
            theme="filled_black"
            shape="pill"
          />
        </div>

        <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>OR EMAIL</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="email" 
              placeholder="Email address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', paddingLeft: '40px' }}
              required 
            />
          </div>
          <div style={{ position: 'relative' }}>
            <LogIn size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', paddingLeft: '40px' }}
              required 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
            {isRegistering ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>{isRegistering ? 'Already have an account?' : 'Need an account?'} </span>
          <button 
            onClick={() => setIsRegistering(!isRegistering)} 
            style={{ background: 'none', color: 'var(--primary)', padding: 0 }}
          >
            {isRegistering ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

        <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
        </div>

        <button 
          onClick={guestLogin} 
          style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        >
          <UserCircle size={18} />
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
