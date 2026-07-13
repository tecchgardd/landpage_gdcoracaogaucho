export type PromotionalCtaTheme = 'social' | 'classes' | 'events' | 'ticketing' | 'albums';
export type PromotionalCtaAction = { label: string; href: string; external?: boolean; ariaLabel?: string };
export type PromotionalCta = { id: string; badge: string; title: string; highlight: string; description: string; image: string; theme: PromotionalCtaTheme; priority: number; primaryAction: PromotionalCtaAction; secondaryAction?: PromotionalCtaAction };

export const promotionalCtaDefinitions: PromotionalCta[] = [
  { id: 'online-ticketing', badge: 'NOVIDADE', title: 'Agora o Coração Gaúcho tem', highlight: 'bilheteria online', description: 'Escolha seus eventos, adicione ao carrinho e compre seus ingressos de forma rápida, prática e segura.', image: '/assets/bg-hero.png', theme: 'ticketing', priority: 100, primaryAction: { label: 'Acessar a bilheteria', href: '/bilheteria' }, secondaryAction: { label: 'Ver eventos disponíveis', href: '/bilheteria' } },
  { id: 'available-classes', badge: 'NOVAS TURMAS', title: 'Está esperando o quê para', highlight: 'começar a dançar?', description: 'Confira as turmas abertas e descubra onde começa a sua próxima experiência com a tradição gaúcha.', image: '/assets/Foto_sobre_1.jpg', theme: 'classes', priority: 80, primaryAction: { label: 'Conferir turmas disponíveis', href: '/curso' }, secondaryAction: { label: 'Saiba como funciona o curso', href: '/sobre' } },
  { id: 'upcoming-events', badge: 'PRÓXIMAS EXPERIÊNCIAS', title: 'Viva nossos', highlight: 'próximos eventos', description: 'Confira bailes, apresentações, cursos e encontros preparados pelo GD Coração Gaúcho.', image: '/assets/bg-hero.png', theme: 'events', priority: 60, primaryAction: { label: 'Conferir próximos eventos', href: '/bilheteria' } },
  { id: 'graduation-albums', badge: 'MOMENTOS ESPECIAIS', title: 'Confira nossos', highlight: 'álbuns de formatura', description: 'Reviva apresentações, formaturas e celebrações registradas ao longo da nossa história.', image: '/assets/ChatGPT Image 10 de jul. de 2026, 19_19_18.png', theme: 'albums', priority: 40, primaryAction: { label: 'Ver álbuns de formatura', href: '/blog' } },
  { id: 'social-media', badge: 'FIQUE POR DENTRO', title: 'Acompanhe o', highlight: 'Coração Gaúcho', description: 'Confira novidades, ensaios, eventos, bailes, turmas e momentos especiais do grupo.', image: '/assets/logo4.png', theme: 'social', priority: 20, primaryAction: { label: 'Seguir no Instagram', href: 'https://www.instagram.com/gdcoracaogaucho/', external: true, ariaLabel: 'Seguir o GD Coração Gaúcho no Instagram' }, secondaryAction: { label: 'Acompanhar no YouTube', href: 'https://www.youtube.com/@nossoscaminhos_gdcoracaogaucho', external: true, ariaLabel: 'Acompanhar o GD Coração Gaúcho no YouTube' } }
];

export const ctaThemeClasses: Record<PromotionalCtaTheme, { accent: string; glow: string; badge: string }> = {
  ticketing: { accent: 'bg-gaucho-red hover:bg-red-700', glow: 'from-red-950/20 via-black/80 to-red-950/70', badge: 'bg-gaucho-red' },
  classes: { accent: 'bg-gaucho-green hover:bg-green-800', glow: 'from-green-950/20 via-black/80 to-green-950/70', badge: 'bg-gaucho-green' },
  events: { accent: 'bg-gaucho-gold text-black hover:bg-yellow-400', glow: 'from-yellow-950/20 via-black/80 to-yellow-950/70', badge: 'bg-gaucho-gold text-black' },
  albums: { accent: 'bg-purple-700 hover:bg-purple-600', glow: 'from-purple-950/20 via-black/80 to-purple-950/70', badge: 'bg-purple-700' },
  social: { accent: 'bg-gradient-to-r from-pink-600 to-gaucho-red hover:from-pink-500', glow: 'from-pink-950/20 via-black/80 to-red-950/70', badge: 'bg-gradient-to-r from-pink-600 to-gaucho-red' }
};
