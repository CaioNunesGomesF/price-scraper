import React from "react";
import { Heart, Bell } from "lucide-react";
import { ListingItem } from "../../../services/searchApi";
import { ProductCard } from "../../search/components/ProductCard";

interface FavoritesViewProps {
  favorites: ListingItem[];
  onToggleFavorite: (item: ListingItem) => void;
  onSelectProduct: (item: ListingItem) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  onToggleFavorite,
  onSelectProduct,
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.innerWrapper}>
        {/* Banner Header */}
        <div
          style={{
            ...styles.bannerHeader,
            animation: "cardPopIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both",
          }}
        >
          <div style={styles.iconRing}>
            <Heart size={22} color="#e74c3c" fill="#e74c3c" />
          </div>
          <div>
            <h2 style={styles.bannerTitle}>Meus Produtos Favoritos & Alertas</h2>
            <p style={styles.bannerSubtitle}>
              Acompanhe a variação de preços e receba notificações sobre ofertas imperdíveis.
            </p>
          </div>
        </div>

        {/* Informative Alert Badge */}
        <div
          style={{
            ...styles.infoBadge,
            animation: "cardPopIn 0.45s 0.1s cubic-bezier(0.34, 1.56, 0.64, 1) both",
          }}
        >
          <Bell size={14} color="var(--accent)" />
          <span>
            Notificações de queda de preço ativas para {favorites.length} produto(s) salvos no seu perfil.
          </span>
        </div>

        {/* Favorites Grid or Empty State */}
        {favorites.length === 0 ? (
          <div
            style={{
              ...styles.emptyState,
              animation: "cardPopIn 0.45s 0.18s cubic-bezier(0.34, 1.56, 0.64, 1) both",
            }}
          >
            <div style={styles.emptyIconRing}>
              <Heart size={32} color="var(--text-muted)" />
            </div>
            <h3 style={styles.emptyTitle}>Nenhum produto favoritado ainda</h3>
            <p style={styles.emptySubtitle}>
              Navegue pelas pesquisas e clique no ícone de coração <Heart size={14} color="#e74c3c" style={{ display: "inline-block", verticalAlign: "middle" }} /> em qualquer oferta para salvar nesta lista e monitorar os preços.
            </p>
          </div>
        ) : (
          <div style={styles.grid}>
            {favorites.map((item, index) => (
              <ProductCard
                key={item.id || item.url || index}
                item={item}
                index={index}
                isFavorite={true}
                onToggleFavorite={(itemToToggle, e) => {
                  e.stopPropagation();
                  onToggleFavorite(itemToToggle);
                }}
                onSelect={() => onSelectProduct(item)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
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
    gap: "20px",
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
    backgroundColor: "rgba(231, 76, 60, 0.12)",
    border: "1px solid rgba(231, 76, 60, 0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  bannerTitle: {
    fontSize: "18px",
    fontWeight: 800,
    color: "var(--text-primary)",
  },
  bannerSubtitle: {
    fontSize: "13px",
    color: "var(--text-secondary)",
    marginTop: "2px",
  },
  infoBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "rgba(90, 122, 106, 0.08)",
    border: "1px solid rgba(90, 122, 106, 0.2)",
    padding: "10px 16px",
    borderRadius: "var(--radius-md)",
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
    gap: "16px",
    marginTop: "8px",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "64px 20px",
    backgroundColor: "var(--bg-secondary)",
    border: "1px dashed var(--border)",
    borderRadius: "var(--radius-lg)",
    marginTop: "16px",
  },
  emptyIconRing: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    backgroundColor: "var(--bg-primary)",
    border: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
  },
  emptyTitle: {
    fontSize: "16px",
    fontWeight: 700,
    color: "var(--text-primary)",
    marginBottom: "6px",
  },
  emptySubtitle: {
    fontSize: "13px",
    color: "var(--text-secondary)",
    maxWidth: "420px",
    lineHeight: "1.5",
  },
};

export default FavoritesView;
