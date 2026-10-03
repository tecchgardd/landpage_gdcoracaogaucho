export type PromotionalCtaTheme = 'events' | 'ticketing' | 'albums' | 'youtube';
export type PromotionalCtaAction = { label: string; href: string; external?: boolean; ariaLabel?: string };
export type PromotionalCta = { id: string; badge: string; title: string; highlight: string; description: string; image: string; theme: PromotionalCtaTheme; priority: number; primaryAction: PromotionalCtaAction; secondaryAction?: PromotionalCtaAction; socialRow?: boolean };

export const promotionalCtaDefinitions: PromotionalCta[] = [
  {
    id: 'bilheteria-social',
    badge: 'NOVIDADE',
    title: 'Garanta seu ingresso e',
    highlight: 'acompanhe de perto',
    description: 'Compre seus ingressos com segurança pela bilheteria online e siga nossas redes para não perder nenhuma novidade do grupo.',
    image: '/assets/bg-hero.png',
    theme: 'ticketing',
    priority: 100,
    primaryAction: { label: 'Acessar a bilheteria', href: '/bilheteria' },
    secondaryAction: { label: 'Seguir no Instagram', href: 'https://www.instagram.com/gdcoracaogaucho/', external: true, ariaLabel: 'Seguir o GD Coração Gaúcho no Instagram' },
    socialRow: true
  },
  {
    id: 'youtube-channel',
    badge: 'NO YOUTUBE',
    title: 'Bailes, ensaios e bastidores',
    highlight: 'direto no YouTube',
    description: 'Inscreva-se no nosso canal e acompanhe vídeos completos de bailes, apresentações e bastidores do Coração Gaúcho.',
    image: '/assets/Foto_sobre_1.jpg',
    theme: 'youtube',
    priority: 90,
    primaryAction: { label: 'Inscrever-se no canal', href: 'https://www.youtube.com/@nossoscaminhos_gdcoracaogaucho', external: true, ariaLabel: 'Inscrever-se no canal do YouTube do Coração Gaúcho' }
  },
  {
    id: 'new-events-classes',
    badge: 'FIQUE POR DENTRO',
    title: 'Novos bailes, eventos e',
    highlight: 'turmas toda semana',
    description: 'Cada novo baile, evento ou turma de curso aparece primeiro por aqui. Confira o que está disponível agora.',
    image: '/assets/bg-hero.png',
    theme: 'events',
    priority: 80,
    primaryAction: { label: 'Ver bilheteria', href: '/bilheteria' },
    secondaryAction: { label: 'Conhecer o curso', href: '/curso' }
  },
  {
    id: 'graduation-albums',
    badge: 'MOMENTOS ESPECIAIS',
    title: 'Confira nossos',
    highlight: 'álbuns de formatura',
    description: 'Reviva apresentações, formaturas e celebrações registradas ao longo da nossa história.',
    image: '/assets/ChatGPT Image 10 de jul. de 2026, 19_19_18.png',
    theme: 'albums',
    priority: 40,
    primaryAction: { label: 'Ver álbuns de formatura', href: '/blog' }
  }
];

export const ctaThemeClasses: Record<PromotionalCtaTheme, { accent: string; glow: string; badge: string }> = {
  ticketing: { accent: 'bg-gaucho-red hover:bg-red-700', glow: 'from-red-950/20 via-black/80 to-red-950/70', badge: 'bg-gaucho-red' },
  events: { accent: 'bg-gaucho-gold text-black hover:bg-yellow-400', glow: 'from-yellow-950/20 via-black/80 to-yellow-950/70', badge: 'bg-gaucho-gold text-black' },
  albums: { accent: 'bg-purple-700 hover:bg-purple-600', glow: 'from-purple-950/20 via-black/80 to-purple-950/70', badge: 'bg-purple-700' },
  youtube: { accent: 'bg-red-600 hover:bg-red-500', glow: 'from-red-950/30 via-black/80 to-black/90', badge: 'bg-red-600' }
};
