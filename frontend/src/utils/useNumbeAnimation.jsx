import { useState, useEffect } from 'react';

const useNumberAnimation = (targetValue, duration = 2000, stepInterval = 50) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (targetValue === null || targetValue === undefined) return;

    const increment = targetValue / (duration / stepInterval); // Calculate step size
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        current = targetValue;
        clearInterval(timer);
      }
      setDisplayValue(Math.round(current)); // Update with rounded value
    }, stepInterval);

    return () => clearInterval(timer); // Cleanup on unmount or value change
  }, [targetValue, duration, stepInterval]);

  return displayValue;
};

export default useNumberAnimation;