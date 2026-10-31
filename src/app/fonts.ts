import { Barlow, Barlow_Condensed, Bricolage_Grotesque, Great_Vibes } from 'next/font/google';

export const sans = Barlow({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sans', display: 'swap' });
export const display = Bricolage_Grotesque({ subsets: ['latin'], weight: ['400', '600', '700', '800'], variable: '--font-display', display: 'swap' });
export const label = Barlow_Condensed({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-label', display: 'swap' });
export const script = Great_Vibes({ subsets: ['latin'], weight: '400', variable: '--font-script', display: 'swap' });
