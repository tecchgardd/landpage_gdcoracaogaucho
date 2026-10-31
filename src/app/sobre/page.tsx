import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDays,
  faCheck,
  faCircleCheck,
  faClock,
  faHeart,
  faPeopleGroup,
  faTicket,
  faUserGroup,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { Header } from '@/components/layout/Header';
import { SocialFloat } from '@/components/layout/SocialFloat';
import { Footer } from '@/components/layout/Footer';
import { MotionSection, MotionStagger, MotionStaggerItem, ParallaxHero } from '@/components/ui/Motion';
import { VideoBackground } from '@/components/ui/VideoBackground';
import { FlagWave } from '@/components/ui/FlagWave';

const courseHighlights = [
  {
    icon: faTicket,
    title: 'Taxa única',
    text: 'Apenas R$ 30,00 de inscrição.'
  },
  {
    icon: faCircleCheck,
    title: 'Sem mensalidade',
    text: 'Nenhuma cobrança mensal durante o curso.'
  },
  {
    icon: faCalendarDays,
    title: '10 aulas',
    text: 'Encontros realizados uma vez por semana.'
  },
  {
    icon: faUserGroup,
    title: 'Não precisa ter par',
    text: 'Todos podem participar e serão bem recebidos.'
  }
];

const rhythms = ['Bugio', 'Marchinha', 'Vanera', 'Chamamé', 'Milonga', 'Valsa', 'Shote', 'Outros ritmos tradicionais'];

const forEveryone = [
  'Iniciantes são bem-vindos',
  'Não precisa ter par',
  'Roupa confortável',
  'Ambiente acolhedor',
  'Acompanhamento dos professores',
  'Aprendizado no próprio ritmo'
];

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-[#f7f7f7] text-[#101010]">
      <Header active="sobre" />
      <SocialFloat />

      <section className="relative overflow-hidden bg-black px-6 pb-20 pt-28 text-white md:pt-32">
        <ParallaxHero className="absolute inset-0 overflow-hidden" strength={80}>
          <VideoBackground page="about" position="center 35%" />
        </ParallaxHero>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/78 to-gaucho-green/45" />
        <div className="relative mx-auto max-w-[1160px]">
          <p className="flex items-center gap-3 text-sm font-black tracking-[.24em] text-gaucho-gold"><i className="h-px w-8 bg-gaucho-gold/70" aria-hidden="true" />TRADIÇÃO • CULTURA • DANÇA</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-black leading-[1.1] md:text-6xl">Sobre o GD Coração Gaúcho</h1>
          <p className="mt-4 max-w-2xl text-xl leading-8 text-white/85">Tradição, cultura e dança que conectam gerações.</p>
        </div>
        <FlagWave />
      </section>

      <MotionSection className="mx-auto grid max-w-[1160px] items-center gap-10 px-6 py-16 md:grid-cols-[1.02fr_.98fr]">
        <div>
          <SectionEyebrow>Nossa trajetória</SectionEyebrow>
          <h2 className="section-heading">Nossa História</h2>
          <div className="mt-6 space-y-5 text-lg leading-8 text-black/72">
            <p>
              Fundado em 2012, o Grupo de Dança Coração Gaúcho nasceu da paixão pela cultura e tradição do Rio Grande do Sul. Ao longo
              de mais de 13 anos, construímos uma trajetória marcada pelo compromisso em ensinar, preservar e transmitir os valores da
              tradição gaúcha por meio da dança.
            </p>
            <p>
              Cada ensaio, apresentação e evento representa muito mais do que uma coreografia. É a oportunidade de manter viva uma
              cultura que atravessa gerações, unindo técnica, emoção e identidade em cada passo.
            </p>
            <p>
              Ao longo dessa caminhada, tivemos a honra de participar de festivais, eventos culturais, apresentações comunitárias e
              formar centenas de alunos, sempre levando conosco o orgulho de representar a tradição gaúcha.
            </p>
            <p>
              Nossa missão é formar pessoas apaixonadas pela cultura do nosso estado, preservando suas raízes e inspirando novas gerações
              a manter viva essa história.
            </p>
          </div>
        </div>
        <ImageCard src="/assets/logo.jpg" alt="Identidade institucional do Grupo de Danças Coração Gaúcho" />
      </MotionSection>

      <MotionSection className="mx-auto grid max-w-[1160px] items-center gap-10 px-6 py-12 md:grid-cols-[.92fr_1.08fr]">
        <ImageCard src="/assets/Foto_sobre_1.jpg" alt="Professor Alan de Abreu e Eliane, responsáveis pelo GD Coração Gaúcho" portrait />
        <div>
          <SectionEyebrow>Alan e Eliane</SectionEyebrow>
          <h2 className="section-heading">Quem está por trás dessa história</h2>
          <div className="mt-6 space-y-5 text-lg leading-8 text-black/72">
            <p>
              À frente do Grupo de Dança Coração Gaúcho estão o Professor Alan de Abreu e sua esposa Eliane, que dedicam suas vidas ao
              ensino da dança tradicional gaúcha.
            </p>
            <p>
              Com carinho, dedicação e muita experiência, Alan conduz cada turma respeitando o tempo de aprendizado de cada aluno,
              enquanto Eliane transforma cada encontro em um ambiente acolhedor, leve e familiar.
            </p>
            <p>
              Essa parceria vai muito além da dança. Ela representa um compromisso verdadeiro com a cultura, a formação de novas amizades
              e a preservação das tradições gaúchas.
            </p>
            <p>
              Mais do que professores, eles se tornaram referência para centenas de alunos que encontraram no grupo um espaço para
              aprender, crescer e criar memórias inesquecíveis.
            </p>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="bg-white py-16">
        <div className="mx-auto max-w-[1160px] px-6">
          <div className="max-w-3xl">
            <SectionEyebrow>Curso de dança</SectionEyebrow>
            <h2 className="section-heading">Nosso Curso de Dança</h2>
            <p className="mt-3 text-xl leading-8 text-black/68">Uma experiência para aprender, se divertir e viver a tradição gaúcha.</p>
            <p className="mt-5 text-lg leading-8 text-black/70">
              O Curso de Dança do Grupo Coração Gaúcho é a oportunidade ideal para quem deseja aprender a dançar com alegria, tradição e
              qualidade. O curso é acessível, acolhedor e foi desenvolvido para receber tanto quem nunca dançou quanto quem já possui
              experiência.
            </p>
          </div>

          <MotionStagger className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {courseHighlights.map((item) => (
              <MotionStaggerItem key={item.title}>
                <article className="h-full rounded-xl border border-black/5 bg-[#fbfbfb] p-6 shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gaucho-red text-xl text-white">
                    <FontAwesomeIcon icon={item.icon} />
                  </div>
                  <h3 className="mt-5 text-xl font-black">{item.title}</h3>
                  <p className="mt-2 leading-7 text-black/65">{item.text}</p>
                </article>
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </div>
      </MotionSection>

      <MotionSection className="mx-auto grid max-w-[1160px] gap-8 px-6 py-16 lg:grid-cols-[.9fr_1.1fr]">
        <div className="rounded-xl bg-gaucho-green p-8 text-white shadow-xl">
          <SectionEyebrow light>Informações práticas</SectionEyebrow>
          <h2 className="font-display text-4xl font-black leading-tight">Como funciona</h2>
          <div className="mt-5 space-y-5 text-lg leading-8 text-white/82">
            <p>
              O curso possui duração de 10 aulas, realizadas uma vez por semana, em horário e local definidos para cada turma. O conteúdo
              foi planejado para proporcionar aprendizado progressivo, convivência saudável e experiências marcantes no universo da
              cultura gaúcha.
            </p>
            <p>
              Os professores acompanham o desenvolvimento de cada participante com atenção, paciência e dedicação, esclarecendo dúvidas e
              respeitando o ritmo individual de aprendizado.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-black/5 bg-white p-8 shadow-xl shadow-black/5">
          <SectionEyebrow>Ritmos ensinados</SectionEyebrow>
          <h2 className="section-heading">Ritmos ensinados</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {rhythms.map((rhythm) => (
              <div key={rhythm} className="flex items-center gap-3 rounded-lg bg-gaucho-cream px-4 py-3 font-bold text-gaucho-green">
                <FontAwesomeIcon icon={faCheck} className="text-gaucho-red" />
                {rhythm}
              </div>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="mx-auto grid max-w-[1160px] items-start gap-8 px-6 py-12 md:grid-cols-[1fr_1fr]">
        <div>
          <SectionEyebrow>Para todos</SectionEyebrow>
          <h2 className="section-heading">Um curso para todos</h2>
          <div className="mt-6 space-y-5 text-lg leading-8 text-black/72">
            <p>
              O curso é indicado tanto para quem nunca dançou quanto para quem já tem experiência e deseja evoluir sua técnica e estilo.
              Não é necessário ter par para participar.
            </p>
            <p>
              Durante as aulas, também não é obrigatório utilizar trajes tradicionais. Cada participante pode usar roupas livres e
              confortáveis. O mais importante é estar à vontade para aprender, se movimentar e aproveitar cada encontro.
            </p>
          </div>
        </div>
        <div className="grid gap-3 rounded-xl bg-white p-6 shadow-xl shadow-black/5 sm:grid-cols-2">
          {forEveryone.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-lg border border-black/5 p-4 text-sm font-bold text-black/78">
              <FontAwesomeIcon icon={faCircleCheck} className="text-gaucho-green" />
              {item}
            </div>
          ))}
        </div>
      </MotionSection>

      <MotionSection className="mx-auto max-w-[1160px] px-6 py-12">
        <div className="relative overflow-hidden rounded-xl bg-black p-8 text-white shadow-premium md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(246,197,69,.28),transparent_28%),linear-gradient(135deg,rgba(207,22,22,.86),rgba(0,91,37,.88)_52%,rgba(0,0,0,.94))]" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gaucho-gold text-2xl text-black">
              <FontAwesomeIcon icon={faHeart} />
            </div>
            <div>
              <SectionEyebrow light>Encerramento do curso</SectionEyebrow>
              <h2 className="font-display text-4xl font-black leading-tight">Baile de Formatura</h2>
            </div>
          </div>
          <i aria-hidden="true" className="relative mt-7 block h-px w-20 bg-gaucho-gold/50" />
          <div className="relative mt-7 grid gap-6 text-lg leading-8 text-white/84 md:grid-cols-2 md:gap-x-10">
            <p className="md:col-span-2 max-w-[65ch] text-xl font-bold leading-8 text-white">Ao final das 10 aulas, acontece um dos momentos mais esperados do curso: o Baile de Formatura.</p>
            <p>Nesse evento, os alunos realizam uma apresentação especial mostrando tudo o que aprenderam durante a jornada. Familiares e amigos são convidados para prestigiar essa conquista.</p>
            <p>Mais do que um baile, é a celebração de uma nova história construída dentro da cultura gaúcha, numa noite de emoção, dança, convivência e tradição.</p>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[.22em] text-gaucho-red">Inscrições</p>
          <h2 className="mt-3 font-display text-4xl font-black leading-tight md:text-5xl">Pronto para viver essa experiência?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-black/68">
            Conheça as próximas turmas e venha fazer parte do GD Coração Gaúcho.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/curso" className="btn-premium rounded-lg bg-gaucho-red px-7 py-4 text-sm font-black uppercase text-white shadow-xl shadow-red-950/20 transition-colors hover:bg-red-700">
              Quero fazer minha inscrição
            </Link>
            <Link href="/loja" className="btn-premium rounded-lg border border-gaucho-green px-7 py-4 text-sm font-black uppercase text-gaucho-green transition-colors hover:bg-gaucho-green hover:text-white">
              Ver próximas turmas
            </Link>
          </div>
        </div>
      </MotionSection>

      <Footer />
    </main>
  );
}

function SectionEyebrow({ children, light = false }: { children: string; light?: boolean }) {
  return <p className={`text-sm font-black uppercase tracking-[.18em] ${light ? 'text-gaucho-gold' : 'text-gaucho-red'}`}>{children}</p>;
}

function ImageCard({ src, alt, portrait = false }: { src: string; alt: string; portrait?: boolean }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white p-3 shadow-2xl shadow-black/12">
      <div className={`relative overflow-hidden rounded-lg ${portrait ? 'h-[520px]' : 'h-[360px]'} sm:h-[420px]`}>
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 520px" />
      </div>
    </div>
  );
}
