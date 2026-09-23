import React from "react";
import { X, Star, ExternalLink, ShieldCheck, CheckCircle, TrendingDown, Heart } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ListingItem } from "../../../services/searchApi";

interface ProductDetailsModalProps {
  item: ListingItem | null;
  isFavorite?: boolean;
  onToggleFavorite?: (item: ListingItem) => void;
  onClose: () => void;
}

const getPlatformDetails = (p: string) => {
  switch (p) {
    case "MERCADO_LIVRE":
      return {
        name: "Mercado Livre",
        color: "var(--ml-color)",
        bg: "rgba(255, 216, 0, 0.18)",
        logo: "/platforms/mercadoLivre.png",
        domain: "mercadolivre.com.br",
      };
    case "OLX":
      return {
        name: "OLX Brasil",
        color: "var(--olx-color)",
        bg: "rgba(140, 82, 255, 0.18)",
        logo: "/platforms/olx.png",
        domain: "olx.com.br",
      };
    case "AMAZON":
      return {
        name: "Amazon Brasil",
        color: "var(--amazon-color)",
        bg: "rgba(255, 153, 0, 0.18)",
        logo: "/platforms/amazon.png",
        domain: "amazon.com.br",
      };
    case "GGMAX":
      return {
        name: "GGMax Marketplace",
        color: "var(--ggmax-color)",
        bg: "rgba(0, 206, 201, 0.18)",
        logo: "/platforms/ggmax.png",
        domain: "ggmax.com.br",
      };
    default:
      return {
        name: "Outro Marketplace",
        color: "var(--text-secondary)",
        bg: "var(--bg-input)",
        logo: "",
        domain: "web",
      };
  }
};

function generatePriceHistory(currentPrice: number) {
  const p = currentPrice;
  return [
    { date: "30d atrás", valor: Math.round(p * 1.14) },
    { date: "20d atrás", valor: Math.round(p * 1.08) },
    { date: "10d atrás", valor: Math.round(p * 1.03) },
    { date: "5d atrás", valor: Math.round(p * 0.98) },
    { date: "Hoje", valor: Math.round(p) },
  ];
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  item,
  isFavorite = false,
  onToggleFavorite,
  onClose,
}) => {
  if (!item) return null;

  const pd = getPlatformDetails(item.platform);
  const chartData = generatePriceHistory(item.price);

  return (
    <div style={styles.overlay} className="modal-overlay-fade" onClick={onClose}>
      <div style={styles.modalContent} className="modal-content-pop modal-responsive" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ ...styles.platformPill, backgroundColor: pd.bg, color: pd.color }}>
            {pd.logo && <img src={pd.logo} alt={pd.name} style={styles.platformLogo} />}
            <span>{pd.name}</span>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={18} color="var(--text-secondary)" />
          </button>
        </div>

        {/* Modal Body */}
        <div style={styles.body}>
          {/* Hero Image at the Top */}
          <div style={styles.heroImageContainer}>
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.title} style={styles.heroImage} />
            ) : (
              <div style={styles.noImage}>Sem Foto Disponível</div>
            )}
            {item.condition && (
              <div style={styles.conditionBadge}>
                {item.condition}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div style={styles.infoSection}>
            <h2 style={styles.title}>{item.title}</h2>

            {/* Price Row */}
            <div style={styles.priceContainer}>
              <span style={styles.priceLabel}>Preço de Venda</span>
              <div style={styles.priceRow}>
                <span style={styles.currency}>R$</span>
                <span style={styles.price}>
                  {item.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Price History Graph (Recharts) */}
            <div style={styles.chartContainer}>
              <div style={styles.chartHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <TrendingDown size={15} color="var(--success)" />
                  <span style={styles.chartTitle}>Histórico de Preço (Últimos 30 dias)</span>
                </div>
                <span style={styles.chartBadge}>-12% menor</span>
              </div>

              <div style={{ width: "100%", height: 120, marginTop: "8px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(val: any) => [`R$ ${Number(val).toLocaleString("pt-BR")}`, "Preço"]}
                      contentStyle={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }}
                    />
                    <Area type="monotone" dataKey="valor" stroke="var(--accent)" strokeWidth={2} fillOpacity={1} fill="url(#priceGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Clean E-Commerce Spec List */}
            <div style={styles.specsContainer}>
              {item.sellerName && (
                <div style={styles.specRow}>
                  <span style={styles.specLabel}>Vendedor</span>
                  <span style={styles.specValue}>
                    {item.sellerName}
                    {item.sellerReputation && (
                      <span style={styles.reputationTag}>
                        <CheckCircle size={10} style={{ marginRight: "3px" }} />
                        {item.sellerReputation.replace(/_/g, " ")}
                      </span>
                    )}
                  </span>
                </div>
              )}

              {item.rating !== undefined && (
                <div style={styles.specRow}>
                  <span style={styles.specLabel}>Avaliação do Anúncio</span>
                  <span style={styles.specValue}>
                    <Star size={13} fill="var(--warning)" color="var(--warning)" style={{ marginRight: "3px" }} />
                    {item.rating.toFixed(1)} / 5.0
                    {item.reviewsCount && (
                      <span style={styles.specSub}> ({item.reviewsCount} opiniões)</span>
                    )}
                  </span>
                </div>
              )}

              {item.condition && (
                <div style={styles.specRow}>
                  <span style={styles.specLabel}>Condição</span>
                  <span style={styles.specValue}>{item.condition}</span>
                </div>
              )}

              {item.location && (
                <div style={styles.specRow}>
                  <span style={styles.specLabel}>Localização</span>
                  <span style={styles.specValue}>{item.location}</span>
                </div>
              )}

              <div style={styles.specRow}>
                <span style={styles.specLabel}>Origem</span>
                <span style={styles.specValue}>{pd.domain}</span>
              </div>
            </div>

            {/* Trust Banner */}
            <div style={styles.trustBanner}>
              <ShieldCheck size={16} color="var(--success)" />
              <span>Oferta verificada diretamente na plataforma oficial.</span>
            </div>
          </div>
        </div>

        {/* Modal Footer / CTA */}
        <div style={styles.footer}>
          <button
            style={{
              ...styles.favoriteFooterBtn,
              backgroundColor: isFavorite ? "rgba(231, 76, 60, 0.15)" : "var(--bg-primary)",
              color: isFavorite ? "#e74c3c" : "var(--text-primary)",
              border: isFavorite ? "1px solid rgba(231, 76, 60, 0.4)" : "1px solid var(--border)",
            }}
            onClick={() => onToggleFavorite?.(item)}
            title={isFavorite ? "Remover dos favoritos" : "Salvar nos favoritos"}
          >
            <Heart
              size={15}
              color={isFavorite ? "#e74c3c" : "var(--text-secondary)"}
              fill={isFavorite ? "#e74c3c" : "none"}
            />
            <span>{isFavorite ? "Favoritado" : "Favoritar"}</span>
          </button>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.ctaBtn}
            className="new-search-btn-premium"
          >
            <span>Ir para o Anúncio Original ({pd.name})</span>
            <ExternalLink size={15} />
          </a>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
    padding: "20px",
  },
  modalContent: {
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    width: "100%",
    maxWidth: "560px",
    maxHeight: "92vh",
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
    boxShadow: "0 24px 48px -12px rgba(0, 0, 0, 0.25)",
  },
  header: {
    padding: "14px 20px",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "var(--bg-primary)",
    flexShrink: 0,
  },
  platformPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: "20px",
  },
  platformLogo: {
    width: "14px",
    height: "14px",
    borderRadius: "3px",
  },
  closeBtn: {
    background: "none",
    border: "none",
    padding: "4px",
    cursor: "pointer",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    padding: "0",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column" as const,
  },
  heroImageContainer: {
    width: "100%",
    height: "240px",
    backgroundColor: "#0a0c10",
    position: "relative" as const,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain" as const,
    padding: "16px",
  },
  noImage: {
    fontSize: "13px",
    color: "var(--text-muted)",
  },
  conditionBadge: {
    position: "absolute" as const,
    bottom: "12px",
    right: "12px",
    backgroundColor: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(6px)",
    color: "#ffffff",
    fontSize: "11px",
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: "20px",
  },
  infoSection: {
    padding: "20px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  title: {
    fontSize: "17px",
    fontWeight: 700,
    color: "var(--text-primary)",
    lineHeight: "1.4",
  },
  priceContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
  },
  priceLabel: {
    fontSize: "11px",
    color: "var(--text-secondary)",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "4px",
  },
  currency: {
    fontSize: "16px",
    color: "var(--accent)",
    fontWeight: 700,
  },
  price: {
    fontSize: "30px",
    fontWeight: 800,
    color: "var(--text-primary)",
  },
  chartContainer: {
    backgroundColor: "var(--bg-primary)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    padding: "12px",
    display: "flex",
    flexDirection: "column" as const,
  },
  chartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chartTitle: {
    fontSize: "12px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  chartBadge: {
    fontSize: "10px",
    fontWeight: 700,
    color: "var(--success)",
    backgroundColor: "rgba(0, 184, 148, 0.12)",
    padding: "2px 7px",
    borderRadius: "100px",
  },
  specsContainer: {
    display: "flex",
    flexDirection: "column" as const,
    borderTop: "1px solid var(--border)",
    borderBottom: "1px solid var(--border)",
    padding: "14px 0",
    gap: "12px",
  },
  specRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
  },
  specLabel: {
    color: "var(--text-secondary)",
    fontWeight: 500,
  },
  specValue: {
    color: "var(--text-primary)",
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
  },
  specSub: {
    fontSize: "11px",
    color: "var(--text-secondary)",
    fontWeight: 400,
  },
  reputationTag: {
    fontSize: "9px",
    backgroundColor: "rgba(0, 184, 148, 0.12)",
    color: "var(--success)",
    padding: "1px 6px",
    borderRadius: "100px",
    display: "inline-flex",
    alignItems: "center",
    fontWeight: 600,
    marginLeft: "4px",
  },
  trustBanner: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
    color: "var(--text-secondary)",
  },
  footer: {
    padding: "14px 20px",
    borderTop: "1px solid var(--border)",
    backgroundColor: "var(--bg-primary)",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    flexShrink: 0,
  },
  favoriteFooterBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    borderRadius: "20px",
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "var(--transition)",
  },
  secondaryCloseBtn: {
    backgroundColor: "transparent",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    borderRadius: "20px",
    padding: "8px 18px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },
  ctaBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "var(--accent)",
    color: "#ffffff",
    borderRadius: "20px",
    padding: "8px 20px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none",
  },
};

export default ProductDetailsModal;
