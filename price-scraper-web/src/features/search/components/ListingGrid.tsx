import React, { useState } from "react";
import { type ListingItem } from "../../../services/searchApi";
import { ProductCard } from "./ProductCard";
import { ProductDetailsModal } from "./ProductDetailsModal";
import { ChevronDown, Download, Scale, AlertTriangle } from "lucide-react";

interface ListingGridProps {
  results: ListingItem[];
  warnings?: string[];
  pageSize?: number;
  favorites?: ListingItem[];
  comparedItems?: ListingItem[];
  onToggleFavorite?: (item: ListingItem) => void;
  onToggleCompare?: (item: ListingItem) => void;
  onOpenComparisonModal?: () => void;
}

export const downloadCSV = (results: ListingItem[], filename = "price_scraper_ofertas.csv") => {
  const headers = ["Titulo", "Preco (BRL)", "Marketplace", "Vendedor", "Avaliacao", "URL"];
  const rows = results.map((item) => [
    `"${item.title.replace(/"/g, '""')}"`,
    item.price,
    item.platform,
    `"${(item.sellerName || "").replace(/"/g, '""')}"`,
    item.rating || "",
    `"${item.url}"`,
  ]);
  const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const ListingGrid: React.FC<ListingGridProps> = ({
  results,
  warnings = [],
  pageSize = 12,
  favorites = [],
  comparedItems = [],
  onToggleFavorite,
  onToggleCompare,
  onOpenComparisonModal,
}) => {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [selectedProduct, setSelectedProduct] = useState<ListingItem | null>(null);

  const visibleResults = results.slice(0, visibleCount);
  const remainingCount = results.length - visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + pageSize);
  };

  const getItemKey = (item: ListingItem) => item.id || item.externalId || item.url;

  const isSelectedFav = selectedProduct
    ? favorites.some((f) => getItemKey(f) === getItemKey(selectedProduct))
    : false;

  return (
    <div style={styles.gridWrapper}>
      {/* Top Utility Strip: Export CSV & Active Comparison Bar */}
      
      {warnings.length > 0 && (
        <div style={{ backgroundColor: "rgba(243, 156, 18, 0.1)", borderLeft: "3px solid var(--warning)", padding: "10px 14px", borderRadius: "0 6px 6px 0", color: "#b9770e", fontSize: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700 }}>
            <AlertTriangle size={14} />
            Aviso de Busca
          </div>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            {warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}
      
      <div style={styles.topUtilityStrip}>
        <button
          onClick={() => downloadCSV(results)}
          style={styles.csvBtn}
          title="Baixar planilha CSV das ofertas encontradas"
        >
          <Download size={13} />
          <span>Exportar Planilha (CSV)</span>
        </button>

        {comparedItems.length > 0 && (
          <button
            onClick={onOpenComparisonModal}
            style={styles.compareBarBtn}
            className="new-search-btn-premium"
          >
            <Scale size={14} />
            <span>Comparar Lado a Lado ({comparedItems.length} selecionados)</span>
          </button>
        )}
      </div>

      <div style={styles.resultsGrid} className="grid-2-cols-mobile">
        {visibleResults.map((item, idx) => {
          const key = getItemKey(item);
          const isFav = favorites.some((f) => getItemKey(f) === key);
          const isComp = comparedItems.some((c) => getItemKey(c) === key);
          return (
            <ProductCard
              key={key || idx}
              item={item}
              index={idx % pageSize}
              isFavorite={isFav}
              isCompared={isComp}
              onToggleFavorite={(itemToToggle) => onToggleFavorite?.(itemToToggle)}
              onToggleCompare={(itemToToggle) => onToggleCompare?.(itemToToggle)}
              onSelect={(prod) => setSelectedProduct(prod)}
            />
          );
        })}
      </div>

      {remainingCount > 0 && (
        <div style={styles.loadMoreWrapper}>
          <button onClick={handleLoadMore} style={styles.loadMoreBtn} className="load-more-btn-hover">
            <span>Carregar mais ofertas ({remainingCount} restantes)</span>
            <ChevronDown size={16} />
          </button>
        </div>
      )}

      <ProductDetailsModal
        item={selectedProduct}
        isFavorite={isSelectedFav}
        onToggleFavorite={(itemToToggle) => onToggleFavorite?.(itemToToggle)}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  gridWrapper: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "14px",
    width: "100%",
  },
  topUtilityStrip: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    gap: "10px",
    flexWrap: "wrap" as const,
  },
  csvBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "var(--bg-secondary)",
    color: "var(--text-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "20px",
    padding: "5px 12px",
    fontSize: "11px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "var(--transition)",
  },
  compareBarBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "var(--accent)",
    color: "#ffffff",
    border: "none",
    borderRadius: "20px",
    padding: "6px 14px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(108,92,231,0.25)",
  },
  resultsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
    gap: "14px",
    width: "100%",
  },
  loadMoreWrapper: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    marginTop: "8px",
  },
  loadMoreBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "var(--bg-secondary)",
    color: "var(--text-primary)",
    border: "1px solid var(--border)",
    borderRadius: "20px",
    padding: "10px 22px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    transition: "var(--transition)",
  },
};

export default ListingGrid;
