import { useState } from 'react';
import './Auth.css';

function Auth({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isSignup) {
      // Signup
      if (!formData.name || !formData.email || !formData.password) {
        setError('All fields are required');
        return;
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (users.find(u => u.email === formData.email)) {
        setError('Email already exists');
        return;
      }

      users.push({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify({ name: formData.name, email: formData.email }));
      onLogin({ name: formData.name, email: formData.email });
    } else {
      // Signin
      if (!formData.email || !formData.password) {
        setError('Email and password are required');
        return;
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === formData.email && u.password === formData.password);

      if (!user) {
        setError('Invalid email or password');
        return;
      }

      localStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email }));
      onLogin({ name: user.name, email: user.email });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>🤖 Procurement AI Assistant</h1>
        <h2>{isSignup ? 'Create Account' : 'Sign In'}</h2>
        
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          {error && <p className="error">{error}</p>}
          
          <button type="submit">{isSignup ? 'Sign Up' : 'Sign In'}</button>
        </form>

        <p className="toggle">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <span onClick={() => {
            setIsSignup(!isSignup);
            setError('');
            setFormData({ email: '', password: '', name: '' });
          }}>
            {isSignup ? ' Sign In' : ' Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;
