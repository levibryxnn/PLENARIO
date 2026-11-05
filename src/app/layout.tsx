import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import { Header } from '@/components/Header';
import 'open-props/easings.min.css';
import './globals.css';
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--pl-inter' });
const manrope = Manrope({ subsets: ['latin'], display: 'swap', variable: '--pl-manrope' });
export const metadata: Metadata = {
  icons: { icon: { url: '/favicon.png', type: 'image/png', sizes: '64x64' } },
  title: { default: 'PLENÁRIO — Informação pública, escolha sua', template: '%s · PLENÁRIO' },
  description:
    'Explore trajetórias políticas a partir de fontes oficiais. Sem rankings de honestidade, com proveniência e limites visíveis.',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.variable + ' ' + manrope.variable}>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <Header />
        {children}
        <footer className="site-footer">
          <span>
            PLENÁRIO <span className="muted">/ Informação pública, escolha sua.</span>
          </span>
          <nav aria-label="Links institucionais">
            <a href="/metodologia">Fontes e metodologia</a>
            <a href="/correcoes">Solicitar correção</a>
            <a href="/admin">Área editorial</a>
          </nav>
          <p className="muted">
            Cobertura inicial limitada. Ausência de registros não significa ausência de fatos ou
            processos.
          </p>
        </footer>
      </body>
    </html>
  );
}
