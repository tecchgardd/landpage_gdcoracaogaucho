import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#00401d] to-[#001609] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[1.2fr_1fr_1fr_1.3fr_1fr]">
        <div>
          <Image src="/assets/logo4.png" alt="Grupo de Danças Coração Gaúcho" width={130} height={130} />
        </div>
        <div>
          <h4 className="mb-4 text-sm font-black">INSTITUCIONAL</h4>
          <div className="space-y-2 text-sm text-white/75">
            <p>Sobre o Grupo</p>
            <p>Curso de Dança</p>
            <p>Bilheteria</p>
            <p>Blog</p>
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-black">LINKS RÁPIDOS</h4>
          <div className="space-y-2 text-sm text-white/75">
            <Link href="/">Home</Link>
            <p>Álbuns</p>
            <Link href="/bilheteria">Eventos</Link>
            <Link href="/#contato">Contato</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-black">CONTATO</h4>
          <p className="text-sm leading-7 text-white/75">
            <a href="https://wa.me/554892210952" target="_blank" rel="noopener noreferrer" aria-label="Falar com o Coração Gaúcho no WhatsApp" className="hover:text-white">+55 48 9221-0952</a>
            <br />
            contato@coracaogaucho.com.br
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-black">HORÁRIOS</h4>
          <p className="text-sm leading-7 text-white/75">
            Segunda a Sexta
            <br />
            13h30 às 22h00
            <br />
            Sábados
            <br />
            08h00 às 12h00
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © 2025 Grupo de Danças Coração Gaúcho. Todos os direitos reservados. Desenvolvido por Gardsoft.
      </div>
    </footer>
  );
}
