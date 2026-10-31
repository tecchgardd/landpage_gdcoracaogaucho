'use client';
import { AuthProvider } from './AuthProvider';
import { CartProvider } from './CartProvider';
import { ConsentProvider, useConsent } from '../consent/ConsentProvider';
import { PromotionalCtaProvider } from '../promotional-cta/PromotionalCtaProvider';
import { YoutubePlaylistPlayer } from '../layout/YoutubePlaylistPlayer';
import { SiteModalsProvider } from '../site/SiteModals';
import { WhatsAppButton } from '../site/WhatsAppButton';

// O player do YouTube carrega cookies do Google: só aparece com consentimento de "Mídia de terceiros".
function ConsentedYoutube() { const { consent } = useConsent(); return consent?.media ? <YoutubePlaylistPlayer /> : null; }

export function Providers({ children }: { children: React.ReactNode }) { return <ConsentProvider><AuthProvider><CartProvider><SiteModalsProvider><PromotionalCtaProvider>{children}<WhatsAppButton /><ConsentedYoutube /></PromotionalCtaProvider></SiteModalsProvider></CartProvider></AuthProvider></ConsentProvider>; }
