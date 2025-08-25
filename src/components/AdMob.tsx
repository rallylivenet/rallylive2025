
"use client";

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

interface AdMobProps {
    adSlot: string;
}

const AdMob = ({ adSlot }: AdMobProps) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error(err);
    }
  }, [adSlot]);

  return (
    <div key={adSlot}>
        <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-3358665652492622"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
        data-ad-status="unfilled"
        />
    </div>
  );
};

export default AdMob;
