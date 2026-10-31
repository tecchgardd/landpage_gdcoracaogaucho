import type { Metadata } from 'next';
import Link from 'next/link';
import { CONTACT_EMAIL, Fill, LegalPage } from '@/components/legal/LegalPage';

export const metadata: Metadata = { title: 'Termos de Uso | Coração Gaúcho', description: 'Regras de uso do site, da loja, dos ingressos e das aulas online do Grupo de Danças Coração Gaúcho.' };

export default function TermsPage() {
  return <LegalPage current="/termos" title="Termos de Uso" updatedAt="31 de outubro de 2026" intro="Estes termos valem para o uso do site, da loja (ingressos, turmas presenciais, cursos online e produtos) e da área do aluno do Grupo de Danças Coração Gaúcho. Ao criar uma conta ou fazer uma compra, você concorda com eles e com a nossa Política de Privacidade.">
    <h2>1. Quem somos</h2>
    <p><Fill>razão social</Fill>, CNPJ <Fill>CNPJ</Fill>, <Fill>endereço completo</Fill>. Contato: {CONTACT_EMAIL} ou pelo WhatsApp informado no site.</p>

    <h2>2. Sua conta</h2>
    <ul>
      <li>Para comprar é preciso ter conta, ser maior de 18 anos e informar dados verdadeiros e atualizados;</li>
      <li>Você é responsável por manter sua senha em sigilo e pelo que for feito na sua conta;</li>
      <li>Podemos suspender contas com indícios de fraude, uso indevido ou violação destes termos.</li>
    </ul>

    <h2>3. Compras e pagamento</h2>
    <ul>
      <li>Preços, disponibilidade e taxas são confirmados no momento do checkout. Se algo mudar entre o carrinho e o pagamento, mostramos a diferença antes de você confirmar;</li>
      <li>O pagamento é processado pelo gateway <Fill>Stripe e/ou Asaas</Fill>. O pedido só é confirmado depois que o pagamento é aprovado;</li>
      <li>Itens no carrinho não ficam reservados até a confirmação do pagamento.</li>
    </ul>

    <h2>4. Ingressos</h2>
    <ul>
      <li>O ingresso fica disponível em <Link href="/minha-conta/ingressos">Minha conta › Meus ingressos</Link>, com QR code individual. Cada QR code vale para uma única entrada;</li>
      <li>Não compartilhe o QR code: a primeira leitura na portaria é a que vale;</li>
      <li>A entrada segue as regras do local e da organização do evento (idade mínima, traje, horário). <Fill>regras de transferência de ingresso e meia-entrada</Fill>;</li>
      <li>Se o evento for cancelado pelo grupo, o valor pago é devolvido integralmente. Se for adiado, o ingresso vale para a nova data ou pode ser reembolsado.</li>
    </ul>

    <h2>5. Direito de arrependimento e reembolso</h2>
    <p>Nas compras feitas pela internet, você pode desistir em até 7 dias corridos da compra (Código de Defesa do Consumidor, art. 49), com devolução integral do valor. <Fill>regras específicas para ingressos perto da data do evento e para cursos online já assistidos — confirmar com o jurídico</Fill>. Para pedir, fale com a gente pelo {CONTACT_EMAIL}.</p>

    <h2>6. Cursos online</h2>
    <ul>
      <li>A compra libera uma licença pessoal e intransferível para assistir às aulas pelo prazo informado na página do curso;</li>
      <li>Cada conta pode assistir em até 2 aparelhos ao mesmo tempo. Você gerencia os aparelhos em <Link href="/minha-conta/dispositivos">Minha conta › Dispositivos</Link>;</li>
      <li>É proibido gravar, baixar, compartilhar, revender ou exibir publicamente as aulas. O descumprimento pode levar ao bloqueio do acesso, sem reembolso.</li>
    </ul>

    <h2>7. Turmas presenciais</h2>
    <p>A inscrição garante a vaga na turma escolhida, nas datas e horários informados. Faltas não geram reposição nem reembolso, salvo quando a aula for cancelada pelo grupo. <Fill>política de troca de turma e trancamento</Fill>.</p>

    <h2>8. Produtos</h2>
    <p><Fill>forma de entrega ou retirada, prazos e custos de frete</Fill>. Produtos com defeito podem ser trocados nos prazos do Código de Defesa do Consumidor (30 dias para produtos não duráveis e 90 dias para duráveis, art. 26).</p>

    <h2>9. Uso do site</h2>
    <p>Não é permitido tentar burlar a segurança do site, automatizar compras (robôs), revender ingressos com ágio ou usar o site para fins ilegais. Podemos limitar a quantidade de itens por pedido e por conta para garantir acesso justo a todos.</p>

    <h2>10. Propriedade intelectual</h2>
    <p>Marca, logotipo, fotos, vídeos, coreografias gravadas e textos do Coração Gaúcho são protegidos por lei e não podem ser usados sem autorização.</p>

    <h2>11. Lei aplicável e foro</h2>
    <p>Estes termos seguem a lei brasileira. Fica eleito o foro do domicílio do consumidor, conforme o Código de Defesa do Consumidor.</p>
  </LegalPage>;
}
