import type { Metadata } from 'next';
import Link from 'next/link';
import { CONTACT_EMAIL, Fill, LegalPage } from '@/components/legal/LegalPage';

export const metadata: Metadata = { title: 'Política de Privacidade | Coração Gaúcho', description: 'Como o Grupo de Danças Coração Gaúcho trata seus dados pessoais, conforme a LGPD.' };

export default function PrivacyPage() {
  return <LegalPage current="/privacidade" title="Política de Privacidade" updatedAt="31 de outubro de 2026" intro="Esta política explica quais dados pessoais o Grupo de Danças Coração Gaúcho coleta no site, na loja e na área do aluno, para que usamos, com quem compartilhamos e como você exerce seus direitos, nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).">
    <h2>1. Quem é o controlador</h2>
    <p>O controlador dos seus dados é <Fill>razão social</Fill>, inscrito no CNPJ <Fill>CNPJ</Fill>, com sede em <Fill>endereço completo</Fill>, que atua com o nome Grupo de Danças Coração Gaúcho.</p>
    <p>Encarregado pelo tratamento de dados (DPO): <Fill>nome do encarregado</Fill> — {CONTACT_EMAIL}.</p>

    <h2>2. Quais dados coletamos</h2>
    <ul>
      <li><b>Cadastro:</b> nome completo, e-mail, CPF, telefone/WhatsApp, data de nascimento, gênero e endereço (CEP, rua, número, complemento, bairro, cidade e estado).</li>
      <li><b>Login social:</b> se você entra com Apple, Facebook, Google ou Microsoft, recebemos o nome, o e-mail e, quando houver, a foto do perfil. Não recebemos sua senha dessas contas.</li>
      <li><b>Compras:</b> itens comprados, valores, forma e status do pagamento e histórico de pedidos. Os dados completos do cartão são digitados no ambiente do gateway de pagamento e não ficam guardados por nós.</li>
      <li><b>Ingressos e turmas:</b> ingressos emitidos (com QR code), check-in nos eventos e inscrições em turmas presenciais.</li>
      <li><b>Aulas online:</b> cursos liberados, progresso das aulas e os aparelhos conectados (tipo de navegador e sistema, data do último acesso e endereço IP), usados para controlar o limite de aparelhos simultâneos.</li>
      <li><b>Navegação:</b> registros de acesso (IP, data e hora) e cookies, conforme a <Link href="/cookies">Política de Cookies</Link>.</li>
      <li><b>Atendimento:</b> mensagens que você nos envia pelo WhatsApp, e-mail ou redes sociais.</li>
    </ul>

    <h2>3. Para que usamos e com qual base legal</h2>
    <table><thead><tr><th>Finalidade</th><th>Base legal (LGPD, art. 7º)</th></tr></thead><tbody>
      <tr><td>Criar e manter sua conta, processar pedidos, emitir ingressos, liberar cursos e turmas</td><td>Execução de contrato (inciso V)</td></tr>
      <tr><td>Emitir nota fiscal e guardar registros fiscais e de acesso</td><td>Cumprimento de obrigação legal (inciso II), inclusive o Marco Civil da Internet</td></tr>
      <tr><td>Prevenir fraudes, proteger a conta e controlar o limite de aparelhos das aulas</td><td>Legítimo interesse (inciso IX) e proteção ao crédito (inciso X)</td></tr>
      <tr><td>Atender pedidos de suporte e exercer direitos em processos</td><td>Execução de contrato e exercício regular de direitos (incisos V e VI)</td></tr>
      <tr><td>Enviar novidades de bailes, turmas e promoções</td><td>Consentimento (inciso I), que você pode retirar a qualquer momento</td></tr>
      <tr><td>Cookies de preferências e mídia de terceiros</td><td>Consentimento (inciso I)</td></tr>
    </tbody></table>

    <h2>4. Com quem compartilhamos</h2>
    <p>Não vendemos seus dados. Compartilhamos apenas o necessário com:</p>
    <ul>
      <li><b>Gateway de pagamento</b> (<Fill>Stripe e/ou Asaas</Fill>), para processar o pagamento e prevenir fraudes;</li>
      <li><b>Hospedagem e infraestrutura</b> (<Fill>provedores, ex.: Vercel, banco de dados</Fill>), onde o site e os dados ficam armazenados;</li>
      <li><b>Cloudinary</b>, que armazena as fotos dos álbuns e eventos;</li>
      <li><b>Provedores de login social</b> (Apple, Facebook, Google, Microsoft), só quando você escolhe entrar por eles;</li>
      <li><b>ViaCEP</b>, que recebe apenas o CEP digitado para preencher o endereço;</li>
      <li><b>YouTube (Google)</b>, somente se você aceitar a mídia de terceiros no aviso de cookies;</li>
      <li><b>Autoridades públicas</b>, quando houver obrigação legal ou ordem judicial.</li>
    </ul>

    <h2>5. Transferência internacional</h2>
    <p>Alguns desses fornecedores guardam dados fora do Brasil (por exemplo, nos Estados Unidos). Nesses casos, a transferência segue o art. 33 da LGPD, com cláusulas contratuais e garantias de proteção equivalentes.</p>

    <h2>6. Por quanto tempo guardamos</h2>
    <ul>
      <li>Dados da conta: enquanto a conta estiver ativa, e depois pelo prazo necessário para cumprir obrigações legais;</li>
      <li>Pedidos e dados fiscais: 5 anos após o fim do exercício, conforme a legislação tributária;</li>
      <li>Registros de acesso ao site: 6 meses (Marco Civil da Internet, art. 15);</li>
      <li>Aparelhos conectados às aulas: até você desconectar o aparelho ou encerrar a conta;</li>
      <li>Consentimentos: enquanto forem válidos, mais o prazo para comprovar que foram dados.</li>
    </ul>

    <h2>7. Seus direitos</h2>
    <p>Pelo art. 18 da LGPD, você pode pedir a qualquer momento: confirmação de que tratamos seus dados; acesso a eles; correção de dados incompletos ou desatualizados; anonimização, bloqueio ou eliminação de dados desnecessários; portabilidade; informação sobre com quem compartilhamos; eliminação dos dados tratados com consentimento; e revogação do consentimento.</p>
    <p>Para exercer seus direitos, escreva para {CONTACT_EMAIL}. Respondemos em até 15 dias. Você também pode corrigir boa parte dos dados direto em <Link href="/minha-conta/perfil">Minha conta › Meus dados</Link>. Se não ficar satisfeito, pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).</p>

    <h2>8. Segurança</h2>
    <p>Usamos conexão criptografada (HTTPS), cookies de sessão protegidos (httpOnly e Secure), senhas guardadas com hash e acesso restrito aos dados por quem precisa deles. Nenhum sistema é 100% imune, mas, se houver um incidente que possa causar risco ou dano relevante, avisaremos você e a ANPD, como manda a lei.</p>

    <h2>9. Crianças e adolescentes</h2>
    <p>Compras e cadastros devem ser feitos por maiores de 18 anos. Inscrições de crianças e adolescentes em turmas e eventos são feitas pelo pai, mãe ou responsável legal, que autoriza o tratamento dos dados do menor no melhor interesse dele (LGPD, art. 14).</p>

    <h2>10. Mudanças nesta política</h2>
    <p>Podemos atualizar esta política. A data no topo mostra a última versão; mudanças importantes serão avisadas no site ou por e-mail.</p>
  </LegalPage>;
}
