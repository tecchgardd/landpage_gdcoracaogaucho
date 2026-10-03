'use client';
import { AuthProvider } from './AuthProvider';
import { CartProvider } from './CartProvider';
import { PromotionalCtaProvider } from '../promotional-cta/PromotionalCtaProvider';
import { YoutubePlaylistPlayer } from '../layout/YoutubePlaylistPlayer';
export function Providers({ children }: { children: React.ReactNode }) { return <AuthProvider><CartProvider><PromotionalCtaProvider>{children}<YoutubePlaylistPlayer /></PromotionalCtaProvider></CartProvider></AuthProvider>; }
