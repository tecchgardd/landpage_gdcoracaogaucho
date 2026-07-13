'use client';

import { ReactNode } from 'react';

export function AutoCarousel({
  children,
  itemClassName = 'w-[220px]',
  speed = 'normal'
}: {
  children: ReactNode;
  itemClassName?: string;
  speed?: 'slow' | 'normal' | 'fast';
}) {
  const items = Array.isArray(children) ? children : [children];
  const speedClass = speed === 'slow' ? 'auto-carousel-slow' : speed === 'fast' ? 'auto-carousel-fast' : 'auto-carousel-normal';

  if (items.length <= 3) return <div className="flex w-full flex-wrap justify-center gap-4 overflow-hidden">{items.map((child, index) => <div className={`auto-carousel-item ${itemClassName}`} key={index}>{child}</div>)}</div>;

  return (
    <div className="auto-carousel group">
      <div className={`auto-carousel-track ${speedClass}`}>
        {[...items, ...items].map((child, index) => (
          <div className={`auto-carousel-item ${itemClassName}`} key={index}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
