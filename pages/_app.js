import '../styles/globals.css';
import 'tailwindcss/tailwind.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useEffect } from 'react';

export default function MyApp({ Component, pageProps }) {
  const [fontSize, setFontSize] = useState('medium');
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = 
      fontSize === 'large' ? '18px' : fontSize === 'medium' ? '16px' : '14px';
    document.documentElement.classList.toggle('high-contrast', highContrast);
  }, [fontSize, highContrast]);

  return (
    <div className={`${highContrast ? 'bg-black text-white' : ''}`}>
      <Component {...pageProps} 
        fontSize={fontSize} 
        setFontSize={setFontSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
      />
    </div>
  );
}
