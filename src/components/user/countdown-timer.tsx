import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  scheduledAt: string;
  setCountdownStarted?: (started: boolean) => void;
}

const CountdownTimer = ({ scheduledAt, setCountdownStarted }: CountdownTimerProps) => {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = new Date().getTime();
      const scheduledTime = new Date(scheduledAt).getTime();
      const timeDifference = scheduledTime - currentTime;

      if (timeDifference <= 0) {
        clearInterval(intervalId);
        setCountdown('00h:00m:00s');
        setCountdownStarted?.(false);
      } else {
        setCountdownStarted?.(true);
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        if (hours === 0 && minutes === 0) {
          setCountdown(`${seconds}s`);
        } else if (hours === 0) {
          setCountdown(`${minutes}m: ${seconds}s`);
        } else {
          setCountdown(`${hours}h: ${minutes}m: ${seconds}s`);
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [scheduledAt, setCountdownStarted]);

  return <p className="text-sm text-muted-foreground">{countdown}</p>;
};

export default CountdownTimer;
