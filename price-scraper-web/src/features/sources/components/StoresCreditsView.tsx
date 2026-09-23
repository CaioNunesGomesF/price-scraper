import React from "react";
import { Store, ShieldCheck, ExternalLink, CheckCircle2 } from "lucide-react";

interface PlatformCredit {
  id: string;
  name: string;
  category: string;
  description: string;
  logo: string;
  brandColor: string;
  bgGlow: string;
  domain: string;
  url: string;
  status: string;
}

const PLATFORMS: PlatformCredit[] = [
  {
    id: "mercado_livre",
    name: "Mercado Livre Brasil",
    category: "Marketplace & Varejo",
    description: "Maior ecossistema de e-commerce e pagamentos da América Latina, com milhões de ofertas de vendedores oficiais e individuais.",
    logo: "/platforms/mercadoLivre.png",
    brandColor: "#ffd800",
    bgGlow: "rgba(255, 216, 0, 0.12)",
    domain: "mercadolivre.com.br",
    url: "https://www.mercadolivre.com.br",
    status: "100% Operacional",
  },
  {
    id: "olx",
    name: "OLX Brasil",
    category: "Usados, Seminovos & Imóveis",
    description: "Líder no mercado de compra e venda online no Brasil para produtos usados, veículos, eletrônicos e anúncios imobiliários.",
    logo: "/platforms/olx.png",
    brandColor: "#8c52ff",
    bgGlow: "rgba(140, 82, 255, 0.12)",
    domain: "olx.com.br",
    url: "https://www.olx.com.br",
    status: "100% Operacional",
  },
  {
    id: "amazon",
    name: "Amazon Brasil",
    category: "Varejo Global & Eletrônicos",
    description: "Maior empresa de e-commerce e tecnologia do mundo, oferecendo milhões de produtos com entrega rápida e garantia oficial.",
    logo: "/platforms/amazon.png",
    brandColor: "#ff9900",
    bgGlow: "rgba(255, 153, 0, 0.12)",
    domain: "amazon.com.br",
    url: "https://www.amazon.com.br",
    status: "100% Operacional",
  },
  {
    id: "ggmax",
    name: "GGMax Marketplace",
    category: "Jogos & Bens Digitais",
    description: "Principal marketplace brasileiro especializado na compra e venda de contas de jogos, moedas virtuais e serviços digitais.",
    logo: "/platforms/ggmax.png",
    brandColor: "#00cec9",
    bgGlow: "rgba(0, 206, 201, 0.12)",
    domain: "ggmax.com.br",
    url: "https://www.ggmax.com.br",
    status: "100% Operacional",
  },
];

export const StoresCreditsView: React.FC = () => {
  return (
    <div style={styles.viewContainer}>
      <div style={styles.innerWrapper}>
        {/* Banner Header */}
        <div
          style={{
            ...styles.bannerHeader,
            animation: "cardPopIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both",
          }}
        >
          <div style={styles.iconRing}>
            <Store size={22} color="var(--accent)" />
          </div>
          <div>
            <h2 style={styles.pageTitle}>Fontes Indexadas & Créditos das Lojas</h2>
            <p style={styles.pageSubtitle}>
              O PriceScraper é um buscador neutro de ofertas. Todos os direitos de imagem, marcas e nomes pertencem aos seus respectivos marketplaces.
            </p>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div
          style={{
            ...styles.disclaimerBox,
            animation: "cardPopIn 0.45s 0.1s cubic-bezier(0.34, 1.56, 0.64, 1) both",
          }}
        >
          <div style={styles.disclaimerIcon}>
            <ShieldCheck size={18} color="var(--accent)" />
          </div>
          <div style={{ fontSize: "12px", lineHeight: "1.6", color: "var(--text-primary)" }}>
            <strong>Termos de Uso & Fair Use:</strong> O PriceScraper não vende produtos nem cobra taxas sobre transações. Nossa plataforma apenas indexa ofertas publicamente disponíveis e redireciona os usuários diretamente para os sites oficiais dos vendedores. Preços e disponibilidade estão sujeitos a alterações nas plataformas originais.
          </div>
        </div>

        {/* Integrated Platforms 2x2 Grid */}
        <div style={styles.grid}>
          {PLATFORMS.map((platform, idx) => (
            <div
              key={platform.id}
              style={{
                ...styles.card,
                animation: "cardPopIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both",
                animationDelay: `${0.18 + idx * 0.08}s`,
              }}
              className="product-card-hover"
            >
              <div style={styles.cardHeader}>
                <div style={{ ...styles.logoBadge, backgroundColor: platform.brandColor }}>
                  <img src={platform.logo} alt={platform.name} style={styles.logoImg} />
                </div>
                <div>
                  <h3 style={styles.cardTitle}>{platform.name}</h3>
                  <span style={styles.cardCategory}>{platform.category}</span>
                </div>
              </div>

              <p style={styles.cardDesc}>{platform.description}</p>

              <div style={styles.metaRow}>
                <div style={styles.statusBadge}>
                  <CheckCircle2 size={12} color="var(--success)" />
                  <span>{platform.status}</span>
                </div>
              </div>

              <a
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.visitBtn}
                className="new-search-btn-premium"
              >
                <span>Visitar {platform.domain}</span>
                <ExternalLink size={13} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  viewContainer: {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    padding: "24px 20px 140px",
    boxSizing: "border-box" as const,
    display: "flex",
    justifyContent: "center",
  },
  innerWrapper: {
    width: "100%",
    maxWidth: "1000px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",
    marginBottom: "80px",
    paddingBottom: "80px",
  },
  bannerHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "20px 24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
  },
  iconRing: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    backgroundColor: "rgba(90, 122, 106, 0.15)",
    border: "1px solid rgba(90, 122, 106, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  pageTitle: {
    fontSize: "18px",
    fontWeight: 800,
    color: "var(--text-primary)",
  },
  pageSubtitle: {
    fontSize: "13px",
    color: "var(--text-secondary)",
    marginTop: "2px",
    lineHeight: "1.5",
  },
  disclaimerBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    backgroundColor: "rgba(90, 122, 106, 0.08)",
    border: "1px solid rgba(90, 122, 106, 0.2)",
    borderRadius: "var(--radius-md)",
    padding: "14px 18px",
  },
  disclaimerIcon: {
    marginTop: "2px",
    flexShrink: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "22px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "14px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoBadge: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  logoImg: {
    width: "24px",
    height: "24px",
    objectFit: "contain" as const,
    borderRadius: "4px",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: 800,
    color: "var(--text-primary)",
  },
  cardCategory: {
    fontSize: "11px",
    color: "var(--text-secondary)",
    fontWeight: 600,
  },
  cardDesc: {
    fontSize: "13px",
    color: "var(--text-secondary)",
    lineHeight: "1.6",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "auto",
    paddingTop: "8px",
  },
  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
    fontWeight: 700,
    color: "var(--success)",
    backgroundColor: "rgba(0, 184, 148, 0.1)",
    padding: "3px 9px",
    borderRadius: "20px",
    border: "1px solid rgba(0, 184, 148, 0.25)",
  },
  rateBadge: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
    color: "var(--text-secondary)",
    backgroundColor: "var(--bg-primary)",
    padding: "3px 9px",
    borderRadius: "20px",
    border: "1px solid var(--border)",
  },
  visitBtn: {
    marginTop: "6px",
    width: "100%",
    backgroundColor: "var(--bg-primary)",
    color: "var(--text-primary)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "10px",
    fontSize: "12px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    cursor: "pointer",
    textDecoration: "none",
    transition: "var(--transition)",
  },
};

export default StoresCreditsView;
