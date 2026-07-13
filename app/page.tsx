import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faEnvelope, faGraduationCap, faHeart, faPaperPlane, faPeopleGroup, faPhone, faTicket } from '@fortawesome/free-solid-svg-icons';
import { Header } from '@/components/Header';
import { SocialFloat } from '@/components/SocialFloat';
import { Footer } from '@/components/Footer';
import { MotionDiv, MotionSection } from '@/components/Motion';
import { PublicAlbumsCarousel } from '@/components/PublicAlbumsCarousel';
import { PublicEventsCarousel } from '@/components/PublicEventsCarousel';
import { PublicClassesSection } from '@/components/PublicClassesSection';
import { VideoBackground } from '@/components/VideoBackground';
import { PublicCompaniesCarousel } from '@/components/PublicCompaniesCarousel';

const stats = [
  { icon: faPeopleGroup, value: '13+', label: 'Anos', color: 'text-green-500' },
  { icon: faGraduationCap, value: '500+', label: 'Alunos', color: 'text-gaucho-red' },
  { icon: faCalendarDays, value: '100+', label: 'Eventos', color: 'text-gaucho-gold' },
  { icon: faHeart, value: '1000+', label: 'Famílias impactadas', color: 'text-green-500' }
];

export default function Home() {
  return (
    <main className="bg-[#f7f7f7] text-[#101010]">
      <Header active="home" />
      <SocialFloat />

      <section className="relative min-h-[650px] overflow-hidden bg-black text-white">
        <VideoBackground page="home" position="center 38%" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/45" />
        <div className="relative mx-auto max-w-[1160px] px-6 pb-28 pt-[150px]">
          <MotionDiv className="max-w-[720px]">
            <p className="mb-3 text-sm font-black tracking-wide text-gaucho-gold">TRADIÇÃO • CULTURA • FAMÍLIA</p>
            <h1 className="text-stroke font-display text-[52px] font-black leading-[.94] md:text-[64px]">
              O coração da <span className="text-gaucho-gold">tradição gaúcha</span> bate aqui.
            </h1>
            <p className="mt-5 max-w-[430px] text-xl leading-7 text-white/90">Há mais de 13 anos formando dançarinos, amizades e histórias.</p>
            <Link href="/bilheteria" className="mt-7 inline-flex items-center rounded-xl bg-gaucho-red px-8 py-4 text-sm font-black uppercase text-white hover:bg-red-700">
              <FontAwesomeIcon icon={faTicket} className="mr-3" /> Comprar ingressos
            </Link>
          </MotionDiv>
        </div>
        <div className="relative z-10 mx-auto -mt-20 grid max-w-[840px] grid-cols-2 gap-5 px-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass flex h-[86px] items-center justify-center gap-4 rounded-lg border-white/15 px-4">
              <FontAwesomeIcon icon={stat.icon} className={`text-4xl ${stat.color}`} />
              <div><b className="block text-3xl leading-none">{stat.value}</b><span className="text-sm text-white/85">{stat.label}</span></div>
            </div>
          ))}
        </div>
        <div className="h-20" />
      </section>

      <MotionSection className="mx-auto max-w-[1160px] px-6 py-10">
        <h2 className="section-title">NOSSOS APOIADORES</h2>
        <div className="mt-6"><PublicCompaniesCarousel /></div>
      </MotionSection>

      <MotionSection className="mx-auto max-w-[1160px] px-6 py-10">
        <h2 className="section-title">ÁLBUNS DE FORMATURA</h2>
        <div className="mt-6"><PublicAlbumsCarousel /></div>
      </MotionSection>

      <MotionSection className="mx-auto max-w-[1160px] px-6 py-6">
        <h2 className="section-title">PRÓXIMOS EVENTOS</h2>
        <div className="mt-6"><PublicEventsCarousel /></div>
        <div className="mt-7 text-center"><Link href="/bilheteria" className="rounded-full border border-gaucho-green px-10 py-3 text-sm font-black uppercase text-gaucho-green hover:bg-gaucho-green hover:text-white">Ver todos os eventos</Link></div>
      </MotionSection>

      <MotionSection className="mx-auto max-w-[1160px] px-6 py-10">
        <h2 className="section-title">TURMAS DISPONÍVEIS E FUTURAS</h2>
        <div className="mt-6"><PublicClassesSection /></div>
      </MotionSection>

      <MotionSection className="mx-auto max-w-[1160px] px-6 pb-14 pt-4">
        <div id="contato" />
        <h2 className="section-title">FALE CONOSCO</h2>
        <div className="mx-auto mt-5 grid max-w-[980px] overflow-hidden rounded-xl bg-white shadow-2xl md:grid-cols-[.82fr_1.18fr]">
          <div className="bg-gaucho-green p-8 text-white">
            <h3 className="font-display text-3xl font-black">Estamos prontos para falar com você.</h3>
            <p className="mt-3 text-sm leading-6 text-white/85">Tire dúvidas sobre cursos, eventos, formaturas e ingressos.</p>
            <p className="mt-8 text-sm"><FontAwesomeIcon icon={faPhone} className="mr-3" /><a href="https://wa.me/554892210952?text=Ol%C3%A1%21%20Vim%20pelo%20site%20do%20GD%20Cora%C3%A7%C3%A3o%20Ga%C3%BAcho%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" aria-label="Falar com o Coração Gaúcho no WhatsApp">+55 48 9221-0952</a></p>
            <p className="mt-4 text-sm"><FontAwesomeIcon icon={faEnvelope} className="mr-3" />contato@coracaogaucho.com.br</p>
          </div>
          <form className="grid content-start gap-4 p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <input className="h-11 rounded-md border border-black/10 px-4 text-sm" placeholder="Nome completo" />
              <input className="h-11 rounded-md border border-black/10 px-4 text-sm" placeholder="E-mail" type="email" />
              <input className="h-11 rounded-md border border-black/10 px-4 text-sm" placeholder="Telefone / WhatsApp" />
              <input className="h-11 rounded-md border border-black/10 px-4 text-sm" placeholder="Assunto" />
            </div>
            <textarea className="min-h-[82px] rounded-md border border-black/10 p-4 text-sm" placeholder="Sua mensagem" />
            <button className="mx-auto rounded-md bg-gaucho-red px-10 py-3 text-sm font-black uppercase text-white"><FontAwesomeIcon icon={faPaperPlane} className="mr-2" />Enviar mensagem</button>
          </form>
        </div>
      </MotionSection>
      <Footer />
    </main>
  );
}
