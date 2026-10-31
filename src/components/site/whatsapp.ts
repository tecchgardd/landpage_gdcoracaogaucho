export const WHATSAPP_NUMBER = '554892210952';
export const INSTAGRAM_URL = 'https://www.instagram.com/gdcoracaogaucho/';
export const YOUTUBE_URL = 'https://www.youtube.com/@nossoscaminhos_gdcoracaogaucho';

export const whatsappLink = (text = 'Olá! Vim pelo site do GD Coração Gaúcho.') => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

// Assuntos que o robô do WhatsApp sabe triar e encaminhar para a pessoa certa do grupo.
export const whatsappTopics = [
  { id: 'curso', emoji: '💃', label: 'Quero aprender a dançar', text: 'Olá! Quero saber das próximas turmas do curso de dança.' },
  { id: 'ingresso', emoji: '🎟️', label: 'Ingressos e bailes', text: 'Olá! Tenho uma dúvida sobre ingressos/bailes.' },
  { id: 'online', emoji: '📱', label: 'Aulas online / acesso', text: 'Olá! Preciso de ajuda com o curso online ou com meu acesso.' },
  { id: 'formatura', emoji: '🎓', label: 'Formaturas e apresentações', text: 'Olá! Quero falar sobre formatura ou contratar uma apresentação.' },
  { id: 'pedido', emoji: '🛍️', label: 'Loja e pedidos', text: 'Olá! Tenho uma dúvida sobre um pedido da loja.' },
  { id: 'outro', emoji: '💬', label: 'Outro assunto', text: 'Olá! Vim pelo site do GD Coração Gaúcho.' }
] as const;
