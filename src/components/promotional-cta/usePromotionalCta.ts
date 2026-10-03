'use client';
import { createContext, useContext } from 'react';
import type { PromotionalCta } from './promotionalCtaDefinitions';
export type PromotionalCtaContextValue = { active: PromotionalCta | null; close: (clicked?: boolean) => void };
export const PromotionalCtaContext = createContext<PromotionalCtaContextValue | null>(null);
export function usePromotionalCta() { const value = useContext(PromotionalCtaContext); if (!value) throw new Error('usePromotionalCta deve ser usado dentro do provider'); return value; }
