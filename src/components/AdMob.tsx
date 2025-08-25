
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
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (err) {
      console.error("adsbygoogle.push() error:", err);
    }
  }, []);

  return (
    <div>
        <ins
        key={adSlot}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-3358665652492622"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
        />
    </div>
  );
};

export default AdMob;
