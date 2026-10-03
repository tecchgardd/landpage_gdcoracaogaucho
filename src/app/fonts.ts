import { Inter, Playfair_Display } from 'next/font/google';

export const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
export const display = Playfair_Display({ subsets: ['latin'], weight: ['700', '800', '900'], variable: '--font-display', display: 'swap' });
