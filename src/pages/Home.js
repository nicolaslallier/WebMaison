import React, { useState, useEffect } from 'react';
import './Home.css';

function Home() {
  const [timestamp, setTimestamp] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set timestamp when component mounts
    setTimestamp(new Date().toLocaleString());
    
    // Trigger animation after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home">
      <div className={`container ${isVisible ? 'visible' : ''}`}>
        <h1>Hello World! 🌍</h1>
        <p>Welcome to your WebMaison React blob</p>
        <div className="blob-info">
          <p>This is a React app served from your blob</p>
        </div>
        <div className="timestamp">
          Generated on: <span>{timestamp}</span>
        </div>
        <div className="react-info">
          <p>Built with React ⚛️</p>
        </div>
        <div className="features-info">
          <p>✨ Now with navigation menu and file management!</p>
        </div>
      </div>
    </div>
  );
}

export default Home; 