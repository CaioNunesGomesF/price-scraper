import React, { useEffect, useState } from "react";
import { X, Star, MapPin, ExternalLink, Award, Loader2 } from "lucide-react";
import { ListingItem, searchApi, CompareResponse } from "../../../services/searchApi";

interface ProductComparisonModalProps {
  items: ListingItem[];
  onClose: () => void;
  onRemoveItem: (item: ListingItem) => void;
}

export const ProductComparisonModal: React.FC<ProductComparisonModalProps> = ({
  items,
  onClose,
  onRemoveItem,
}) => {
  const [comparisonData, setComparisonData] = useState<CompareResponse["data"] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (items.length > 0) {
      setLoading(true);
      searchApi.compare(items)
        .then(res => setComparisonData(res.data))
        .catch(err => console.error("Erro na comparação:", err))
        .finally(() => setLoading(false));
    } else {
      setComparisonData(null);
    }
  }, [items]);

  if (items.length === 0) return null;

  const displayItems = comparisonData?.items || items.map(i => ({ ...i, isBestPrice: false, savingsPercentage: 0 }));

  return (
    <div style={styles.overlay} className="modal-overlay-fade" onClick={onClose}>
      <div style={styles.modalContent} className="modal-content-pop modal-responsive" onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Comparador Lado a Lado ({items.length} ofertas)</h2>
            <p style={styles.subtitle}>
              Análise comparativa direta de preços, reputação de vendedores e condições dos anúncios.
            </p>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={18} color="var(--text-secondary)" />
          </button>
        </div>

        <div style={styles.body}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
              <Loader2 size={32} className="animate-spin" color="var(--primary)" />
            </div>
          ) : (
          <div style={styles.scrollWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.featureTh}>Característica</th>
                  {displayItems.map((item, idx) => {
                    const isBestPrice = item.isBestPrice && items.length > 1;
                    return (
                      <th key={item.id || item.url || idx} style={styles.itemTh}>
                        <div style={styles.thCardHeader}>
                          {isBestPrice && (
                            <div style={styles.bestPriceBadge}>
                              <Award size={11} />
                              <span>Melhor Preço</span>
                            </div>
                          )}

                          <button
                            style={styles.removeItemBtn}
                            onClick={() => onRemoveItem(item)}
                            title="Remover da comparação"
                          >
                            <X size={12} />
                          </button>

                          <div style={styles.imgWrapper}>
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.title} style={styles.productImg} />
                            ) : (
                              <div style={styles.noImg}>Sem imagem</div>
                            )}
                          </div>
                          <div style={styles.itemTitle}>{item.title}</div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={styles.featureTd}>Preço Anunciado</td>
                  {displayItems.map((item, idx) => {
                    const isBestPrice = item.isBestPrice && items.length > 1;
                    return (
                      <td key={idx} style={{ ...styles.valueTd, backgroundColor: isBestPrice ? "rgba(0, 184, 148, 0.08)" : "transparent" }}>
                        <div style={{ ...styles.priceText, color: isBestPrice ? "var(--success)" : "var(--text-primary)" }}>
                          R$ {item.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </div>
                        {isBestPrice && item.savingsPercentage > 0 && (
                          <span style={styles.bestDealTag}>
                            Economia de {item.savingsPercentage}%
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Marketplace */}
                <tr>
                  <td style={styles.featureTd}>Plataforma / Marketplace</td>
                  {items.map((item, idx) => (
                    <td key={idx} style={styles.valueTd}>
                      <span style={styles.platformBadge}>{item.platform.replace("_", " ")}</span>
                    </td>
                  ))}
                </tr>

                {/* Vendedor */}
                <tr>
                  <td style={styles.featureTd}>Vendedor</td>
                  {items.map((item, idx) => (
                    <td key={idx} style={styles.valueTd}>
                      {item.sellerName || "Não informado"}
                    </td>
                  ))}
                </tr>

                {/* Avaliação */}
                <tr>
                  <td style={styles.featureTd}>Avaliação / Reputação</td>
                  {items.map((item, idx) => (
                    <td key={idx} style={styles.valueTd}>
                      {item.rating ? (
                        <div style={styles.ratingBox}>
                          <Star size={13} fill="var(--warning)" color="var(--warning)" />
                          <span style={{ fontWeight: 700 }}>{item.rating.toFixed(1)}</span>
                          {item.reviewsCount && (
                            <span style={{ color: "var(--text-secondary)", fontSize: "11px" }}>
                              ({item.reviewsCount})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: "var(--text-secondary)" }}>Sem avaliação</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Localização */}
                <tr>
                  <td style={styles.featureTd}>Localização</td>
                  {items.map((item, idx) => (
                    <td key={idx} style={styles.valueTd}>
                      {item.location ? (
                        <div style={styles.locationBox}>
                          <MapPin size={12} color="var(--text-secondary)" />
                          <span>{item.location}</span>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                  ))}
                </tr>

                {/* Condição */}
                <tr>
                  <td style={styles.featureTd}>Estado / Condição</td>
                  {items.map((item, idx) => (
                    <td key={idx} style={styles.valueTd}>
                      <span style={styles.conditionTag}>{item.condition || "Novo"}</span>
                    </td>
                  ))}
                </tr>

                {/* Ação / Link */}
                <tr>
                  <td style={styles.featureTd}>Acesso ao Anúncio</td>
                  {items.map((item, idx) => (
                    <td key={idx} style={styles.valueTd}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.ctaBtn}
                        className="new-search-btn-premium"
                      >
                        <span>Ir para Oferta</span>
                        <ExternalLink size={13} />
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 350,
    padding: "20px",
  },
  modalContent: {
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    width: "100%",
    maxWidth: "960px",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
    boxShadow: "0 24px 50px -12px rgba(0, 0, 0, 0.3)",
  },
  header: {
    padding: "18px 24px",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "var(--bg-primary)",
    flexShrink: 0,
  },
  title: {
    fontSize: "18px",
    fontWeight: 800,
    color: "var(--text-primary)",
  },
  subtitle: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    marginTop: "2px",
  },
  closeBtn: {
    background: "none",
    border: "none",
    padding: "4px",
    cursor: "pointer",
    borderRadius: "50%",
  },
  body: {
    padding: "20px 24px 30px",
    overflowY: "auto",
    flex: 1,
  },
  scrollWrapper: {
    overflowX: "auto",
    width: "100%",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    textAlign: "left" as const,
    fontSize: "13px",
  },
  featureTh: {
    padding: "12px",
    fontWeight: 700,
    color: "var(--text-secondary)",
    borderBottom: "2px solid var(--border)",
    width: "180px",
    minWidth: "160px",
  },
  itemTh: {
    padding: "12px",
    borderBottom: "2px solid var(--border)",
    minWidth: "220px",
    verticalAlign: "top",
  },
  thCardHeader: {
    position: "relative" as const,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    textAlign: "center" as const,
    gap: "8px",
  },
  bestPriceBadge: {
    backgroundColor: "var(--success)",
    color: "#ffffff",
    fontSize: "10px",
    fontWeight: 800,
    padding: "3px 8px",
    borderRadius: "20px",
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    marginBottom: "4px",
  },
  removeItemBtn: {
    position: "absolute" as const,
    top: 0,
    right: 0,
    backgroundColor: "var(--bg-primary)",
    border: "1px solid var(--border)",
    color: "var(--text-secondary)",
    borderRadius: "50%",
    width: "22px",
    height: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  imgWrapper: {
    width: "70px",
    height: "70px",
    borderRadius: "8px",
    backgroundColor: "#08080f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  productImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain" as const,
  },
  noImg: {
    fontSize: "10px",
    color: "var(--text-muted)",
  },
  itemTitle: {
    fontSize: "12px",
    fontWeight: 700,
    color: "var(--text-primary)",
    lineHeight: "1.4",
    maxHeight: "34px",
    overflow: "hidden",
  },
  featureTd: {
    padding: "12px",
    fontWeight: 600,
    color: "var(--text-secondary)",
    borderBottom: "1px solid var(--border)",
  },
  valueTd: {
    padding: "12px",
    borderBottom: "1px solid var(--border)",
    textAlign: "center" as const,
    verticalAlign: "middle",
  },
  priceText: {
    fontSize: "16px",
    fontWeight: 800,
  },
  bestDealTag: {
    fontSize: "10px",
    color: "var(--success)",
    fontWeight: 700,
    marginTop: "2px",
    display: "block",
  },
  platformBadge: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: 700,
    backgroundColor: "var(--bg-primary)",
    border: "1px solid var(--border)",
    padding: "2px 8px",
    borderRadius: "20px",
  },
  ratingBox: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    justifyContent: "center",
  },
  locationBox: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "12px",
  },
  conditionTag: {
    fontSize: "11px",
    backgroundColor: "var(--bg-primary)",
    padding: "2px 8px",
    borderRadius: "4px",
    border: "1px solid var(--border)",
  },
  ctaBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    backgroundColor: "var(--accent)",
    color: "#ffffff",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 700,
    textDecoration: "none",
  },
};

export default ProductComparisonModal;
