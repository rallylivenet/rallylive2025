
'use client';

import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval as keyof typeof timeLeft] && interval !== 'seconds' && timeLeft.days === 0 && (interval !== 'minutes' || timeLeft.hours === 0) ) {
        if(interval === 'days' && timeLeft.days === 0) return null;
        if(interval === 'hours' && timeLeft.days === 0 && timeLeft.hours === 0) return null;
        if(interval === 'minutes' && timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0) return null;
    }

    return (
      <div key={interval} className="flex flex-col items-center">
        <span className="text-4xl font-bold text-primary">
          {String(timeLeft[interval as keyof typeof timeLeft]).padStart(2, '0')}
        </span>
        <span className="text-sm uppercase text-muted-foreground">{interval}</span>
      </div>
    );
  });

  return (
    <div className="flex justify-center gap-4 md:gap-8">
      {Object.values(timeLeft).every(val => val === 0) ? (
        <span className="text-2xl font-bold text-accent">Rally is starting!</span>
      ) : (
        timerComponents
      )}
    </div>
  );
};

export default Countdown;
