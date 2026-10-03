'use client';
import { AuthProvider } from './AuthProvider';
import { CartProvider } from './CartProvider';
import { PromotionalCtaProvider } from '../promotional-cta/PromotionalCtaProvider';
export function Providers({ children }: { children: React.ReactNode }) { return <AuthProvider><CartProvider><PromotionalCtaProvider>{children}</PromotionalCtaProvider></CartProvider></AuthProvider>; }
