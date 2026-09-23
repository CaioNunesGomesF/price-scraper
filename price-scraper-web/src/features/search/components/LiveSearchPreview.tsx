import React from "react";
import { Zap, Loader2, ArrowRight, TrendingDown } from "lucide-react";
import type { ListingItem } from "../../../services/searchApi";
import { PLATFORM_OPTIONS } from "./PlatformMultiSelect";

interface LiveSearchPreviewProps {
  isOpen: boolean;
  isLoading: boolean;
  query: string;
  results: ListingItem[];
  total: number;
  fromCache?: boolean;
  onSelectProduct: (product: ListingItem) => void;
  onViewAll: () => void;
  onClose: () => void;
}

export const LiveSearchPreview: React.FC<LiveSearchPreviewProps> = ({
  isOpen,
  isLoading,
  query,
  results,
  total,
  fromCache,
  onSelectProduct,
  onViewAll,
}) => {
  if (!isOpen || query.trim().length < 2) {
    return null;
  }

  const topItems = results.slice(0, 4);
  const lowestPrice = results.length > 0 ? Math.min(...results.map((r) => r.price)) : 0;

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
  };

  const getPlatformLogo = (platform: string) => {
    const found = PLATFORM_OPTIONS.find((p) => p.id === platform);
    return found?.logo;
  };

  return (
    <div style={styles.container} className="select-dropdown-anim">
      {/* Header bar */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <Zap size={14} color="var(--accent)" />
          <span style={styles.headerTitle}>
            {isLoading ? "Buscando em tempo real..." : `Resultados Rápidos para "${query}"`}
          </span>
        </div>

        <div style={styles.headerRight}>
          {isLoading ? (
            <Loader2 size={13} className="spin-slow" color="var(--accent)" />
          ) : fromCache ? (
            <span style={styles.cachePill}>⚡ Do Cache</span>
          ) : (
            <span style={styles.countPill}>{total} encontradas</span>
          )}
        </div>
      </div>

      {/* Loading state skeleton */}
      {isLoading && results.length === 0 && (
        <div style={styles.loadingBox}>
          <Loader2 size={20} className="spin-slow" color="var(--accent)" />
          <span style={styles.loadingText}>Consultando lojas parceiras...</span>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && results.length === 0 && (
        <div style={styles.emptyBox}>
          <span>Nenhuma oferta encontrada para este termo.</span>
        </div>
      )}

      {/* Quick preview list */}
      {topItems.length > 0 && (
        <>
          {lowestPrice > 0 && (
            <div style={styles.lowestBanner}>
              <TrendingDown size={13} color="#27ae60" />
              <span>Menor preço encontrado: <strong>{formatBRL(lowestPrice)}</strong></span>
            </div>
          )}

          <div style={styles.list}>
            {topItems.map((item, idx) => {
              const logo = getPlatformLogo(item.platform);
              return (
                <div
                  key={item.id || item.url || idx}
                  style={styles.itemCard}
                  onClick={() => onSelectProduct(item)}
                  className="live-preview-card"
                >
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} style={styles.itemImage} />
                  ) : (
                    <div style={styles.itemImageFallback}>
                      {logo && <img src={logo} alt={item.platform} style={{ width: 18, height: 18 }} />}
                    </div>
                  )}

                  <div style={styles.itemDetails}>
                    <span style={styles.itemTitle} title={item.title}>
                      {item.title}
                    </span>
                    <div style={styles.itemSubRow}>
                      {logo && (
                        <img
                          src={logo}
                          alt={item.platform}
                          style={styles.platformIcon}
                          title={item.platform}
                        />
                      )}
                      <span style={styles.itemSeller}>
                        {item.sellerName || item.platform}
                      </span>
                    </div>
                  </div>

                  <div style={styles.priceColumn}>
                    <span style={styles.itemPrice}>{formatBRL(item.price)}</span>
                    {item.condition && (
                      <span style={styles.conditionTag}>{item.condition}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer CTA to see all */}
          <button type="button" onClick={onViewAll} style={styles.footerBtn}>
            <span>Ver todas as {total} ofertas completas</span>
            <ArrowRight size={14} />
          </button>
        </>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: 0,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid var(--border)",
    borderRadius: "18px",
    boxShadow: "0 18px 45px rgba(0, 0, 0, 0.14), 0 4px 12px rgba(0, 0, 0, 0.04)",
    padding: "10px",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "4px 8px 8px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  headerTitle: {
    fontSize: "12px",
    fontWeight: 700,
    color: "var(--text-primary)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "340px",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
  },
  countPill: {
    fontSize: "10px",
    fontWeight: 700,
    backgroundColor: "rgba(108, 92, 231, 0.12)",
    color: "var(--accent)",
    padding: "2px 8px",
    borderRadius: "12px",
  },
  cachePill: {
    fontSize: "10px",
    fontWeight: 700,
    backgroundColor: "rgba(243, 156, 18, 0.14)",
    color: "#d35400",
    padding: "2px 8px",
    borderRadius: "12px",
  },
  loadingBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "20px",
    color: "var(--text-secondary)",
    fontSize: "12px",
  },
  loadingText: {
    fontWeight: 500,
  },
  emptyBox: {
    padding: "18px",
    textAlign: "center",
    fontSize: "12px",
    color: "var(--text-muted)",
  },
  lowestBanner: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 8px",
    backgroundColor: "rgba(39, 174, 96, 0.08)",
    borderRadius: "8px",
    fontSize: "11px",
    color: "#27ae60",
    fontWeight: 500,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  itemCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 10px",
    borderRadius: "10px",
    cursor: "pointer",
    backgroundColor: "transparent",
    transition: "background-color 0.15s, transform 0.15s",
    border: "1px solid transparent",
  },
  itemImage: {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    objectFit: "contain",
    backgroundColor: "#ffffff",
    border: "1px solid var(--border)",
    flexShrink: 0,
  },
  itemImageFallback: {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    backgroundColor: "rgba(0,0,0,0.03)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  itemDetails: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  itemTitle: {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--text-primary)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  itemSubRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  platformIcon: {
    width: "12px",
    height: "12px",
    borderRadius: "2px",
    objectFit: "contain",
  },
  itemSeller: {
    fontSize: "10px",
    color: "var(--text-muted)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  priceColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "2px",
    flexShrink: 0,
  },
  itemPrice: {
    fontSize: "13px",
    fontWeight: 800,
    color: "var(--accent)",
  },
  conditionTag: {
    fontSize: "9px",
    fontWeight: 600,
    padding: "1px 4px",
    borderRadius: "4px",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    color: "var(--text-muted)",
  },
  footerBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    backgroundColor: "var(--accent)",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "8px 14px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "4px",
    transition: "opacity 0.15s, transform 0.1s",
  },
};

export default LiveSearchPreview;
