import React, { useEffect } from 'react';
import { ADSENSE_CLIENT, AD_SLOTS } from '../config/ads';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdBannerProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle' | 'in-feed';
  className?: string;
}

const FORMAT_CONFIG: Record<string, { slotKey: keyof typeof AD_SLOTS; adFormat: string; minHeight: string; layoutKey?: string }> = {
  horizontal: { slotKey: 'horizontal', adFormat: 'auto', minHeight: 'min-h-[90px] sm:min-h-[110px]' },
  rectangle: { slotKey: 'rectangle', adFormat: 'rectangle', minHeight: 'min-h-[250px]' },
  'in-feed': { slotKey: 'inFeed', adFormat: 'fluid', minHeight: 'min-h-[120px]', layoutKey: '-fb+5w+4e-db+86' },
};

export const AdBanner: React.FC<AdBannerProps> = ({ slotId, format = 'horizontal', className = '' }) => {
  const config = FORMAT_CONFIG[format];
  const finalSlotId = slotId || (config ? AD_SLOTS[config.slotKey] : '');

  useEffect(() => {
    if (!finalSlotId) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense script not loaded yet or unit already filled
    }
  }, [finalSlotId]);

  if (!finalSlotId) return null;

  return (
    <div className={`w-full overflow-hidden my-6 flex justify-center ${className}`}>
      <ins
        className={`adsbygoogle ${config.minHeight}`}
        style={{ display: 'block', width: '100%' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={finalSlotId}
        data-ad-format={config.adFormat}
        {...(config.layoutKey ? { 'data-ad-layout-key': config.layoutKey } : {})}
        data-full-width-responsive="true"
      />
    </div>
  );
};