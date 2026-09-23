import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Layers,
  Info,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Store,
} from "lucide-react";
import { ListingItem } from "../../../services/searchApi";
import { ListingGrid } from "./ListingGrid";
import { PLATFORM_OPTIONS } from "./PlatformMultiSelect";

export interface ChatMessage {
  id: string;
  sender: "user" | "system";
  text: string;
  timestamp: Date;
  isSearching?: boolean;
  results?: ListingItem[];
  warnings?: string[];
  meta?: {
    fromCache: boolean;
    total: number;
    category: string;
    query: string;
  };
}

interface ChatMessageItemProps {
  msg: ChatMessage;
  isLatest?: boolean;
  favorites?: ListingItem[];
  comparedItems?: ListingItem[];
  onToggleFavorite?: (item: ListingItem) => void;
  onToggleCompare?: (item: ListingItem) => void;
  onOpenComparisonModal?: () => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  msg,
  isLatest = true,
  favorites = [],
  comparedItems = [],
  onToggleFavorite,
  onToggleCompare,
  onOpenComparisonModal,
}) => {
  const isUser = msg.sender === "user";
  const [isExpanded, setIsExpanded] = useState(isLatest);

  // Quick Refinement State (Conversational Filter pós-busca)
  const [activePlatform, setActivePlatform] = useState<string>("ALL");
  const [activeSort, setActiveSort] = useState<"price_asc" | "price_desc" | "rating_desc">("price_asc");
  const [maxPriceFilter, setMaxPriceFilter] = useState<number | null>(null);

  // Auto-collapse when new searches arrive if not latest
  useEffect(() => {
    setIsExpanded(isLatest);
  }, [isLatest]);

  // Available platform counts in the returned results
  const platformCounts = useMemo(() => {
    if (!msg.results) return {};
    const counts: Record<string, number> = {};
    for (const item of msg.results) {
      counts[item.platform] = (counts[item.platform] || 0) + 1;
    }
    return counts;
  }, [msg.results]);

  // Dynamic price ranges based on results
  const priceBrackets = useMemo(() => {
    if (!msg.results || msg.results.length === 0) return [];
    const prices = msg.results.map((r) => r.price).filter((p) => p > 0);
    if (prices.length === 0) return [];
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (max - min < 50) return [];

    const lowTier = Math.round(min + (max - min) * 0.33);
    const midTier = Math.round(min + (max - min) * 0.66);

    return [
      { label: `Até R$ ${lowTier}`, max: lowTier },
      { label: `Até R$ ${midTier}`, max: midTier },
    ];
  }, [msg.results]);

  // Client-side instant filter & sort (0ms response)
  const filteredResults = useMemo(() => {
    if (!msg.results) return [];
    let list = [...msg.results];

    // Filter by platform
    if (activePlatform !== "ALL") {
      list = list.filter((item) => item.platform === activePlatform);
    }

    // Filter by price
    if (maxPriceFilter !== null) {
      list = list.filter((item) => item.price <= maxPriceFilter);
    }

    // Sort
    if (activeSort === "price_asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (activeSort === "price_desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (activeSort === "rating_desc") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [msg.results, activePlatform, activeSort, maxPriceFilter]);

  return (
    <div
      style={{
        ...styles.messageWrapper,
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      {!isUser && (
        <div style={styles.avatar}>
          <Search size={14} color="var(--accent)" />
        </div>
      )}

      <div
        style={{
          ...styles.messageBubbleContainer,
          alignItems: isUser ? "flex-end" : "flex-start",
        }}
      >
        <div
          style={{
            ...styles.messageBubble,
            background: isUser ? "var(--bg-bubble-user)" : "var(--bg-bubble-ai)",
            border: isUser ? "none" : "1px solid var(--border)",
            color: isUser ? "#ffffff" : "var(--text-primary)",
            alignSelf: isUser ? "flex-end" : "flex-start",
            borderRadius: isUser ? "18px 18px 4px 18px" : "var(--radius-lg)",
          }}
        >
          <div style={styles.messageText}>{msg.text}</div>

          {msg.isSearching && (
            <div style={styles.loadingDots}>
              <span style={styles.dot}></span>
              <span style={{ ...styles.dot, animationDelay: "0.2s" }}></span>
              <span style={{ ...styles.dot, animationDelay: "0.4s" }}></span>
            </div>
          )}

          {msg.meta && (
            <div style={styles.searchMetaCard}>
              <div style={styles.metaBadge}>
                <Layers size={11} />
                <span>Cat: {msg.meta.category}</span>
              </div>
              <div style={styles.metaBadge}>
                <Info size={11} />
                <span>{msg.meta.fromCache ? "⚡ Cache Instantâneo" : "Busca Direta"}</span>
              </div>
              <div style={styles.metaBadge}>
                <ShoppingBag size={11} />
                <span>{msg.meta.total} ofertas</span>
              </div>
            </div>
          )}
        </div>

        {/* Refinamento Pós-Busca: Chips Interativos Conversacionais */}
        {msg.results && msg.results.length > 0 && (
          <div style={styles.refinementContainer}>
            <div style={styles.refinementHeader}>
              <span style={styles.refinementTitle}>
                <SlidersHorizontal size={13} color="var(--accent)" />
                Refinar Resultados ({filteredResults.length} de {msg.results.length}):
              </span>
            </div>

            {/* Platform Filter Chips */}
            <div style={styles.chipsScrollRow} className="scroll-x-mobile">
              <button
                type="button"
                onClick={() => setActivePlatform("ALL")}
                style={{
                  ...styles.chipBtn,
                  backgroundColor: activePlatform === "ALL" ? "var(--accent)" : "var(--bg-secondary)",
                  color: activePlatform === "ALL" ? "#ffffff" : "var(--text-secondary)",
                  borderColor: activePlatform === "ALL" ? "var(--accent)" : "var(--border)",
                  fontWeight: activePlatform === "ALL" ? 700 : 500,
                }}
              >
                <Store size={12} />
                <span>Todas ({msg.results.length})</span>
              </button>

              {PLATFORM_OPTIONS.map((opt) => {
                const count = platformCounts[opt.id] || 0;
                if (count === 0) return null;
                const isSelected = activePlatform === opt.id;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setActivePlatform(isSelected ? "ALL" : opt.id)}
                    style={{
                      ...styles.chipBtn,
                      backgroundColor: isSelected ? "var(--accent)" : "var(--bg-secondary)",
                      color: isSelected ? "#ffffff" : "var(--text-secondary)",
                      borderColor: isSelected ? "var(--accent)" : "var(--border)",
                      fontWeight: isSelected ? 700 : 500,
                    }}
                  >
                    <img src={opt.logo} alt={opt.label} style={styles.chipLogo} />
                    <span>{opt.label} ({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Sorting & Price Filter Chips */}
            <div style={styles.chipsSecondaryRow} className="scroll-x-mobile">
              <span style={styles.subFilterLabel}>Ordenar:</span>
              <button
                type="button"
                onClick={() => setActiveSort("price_asc")}
                style={{
                  ...styles.miniChipBtn,
                  backgroundColor: activeSort === "price_asc" ? "rgba(108, 92, 231, 0.12)" : "transparent",
                  color: activeSort === "price_asc" ? "var(--accent)" : "var(--text-muted)",
                  borderColor: activeSort === "price_asc" ? "var(--accent)" : "var(--border)",
                  fontWeight: activeSort === "price_asc" ? 700 : 500,
                }}
              >
                Menor Preço
              </button>

              <button
                type="button"
                onClick={() => setActiveSort("price_desc")}
                style={{
                  ...styles.miniChipBtn,
                  backgroundColor: activeSort === "price_desc" ? "rgba(108, 92, 231, 0.12)" : "transparent",
                  color: activeSort === "price_desc" ? "var(--accent)" : "var(--text-muted)",
                  borderColor: activeSort === "price_desc" ? "var(--accent)" : "var(--border)",
                  fontWeight: activeSort === "price_desc" ? 700 : 500,
                }}
              >
                Maior Preço
              </button>

              <button
                type="button"
                onClick={() => setActiveSort("rating_desc")}
                style={{
                  ...styles.miniChipBtn,
                  backgroundColor: activeSort === "rating_desc" ? "rgba(108, 92, 231, 0.12)" : "transparent",
                  color: activeSort === "rating_desc" ? "var(--accent)" : "var(--text-muted)",
                  borderColor: activeSort === "rating_desc" ? "var(--accent)" : "var(--border)",
                  fontWeight: activeSort === "rating_desc" ? 700 : 500,
                }}
              >
                Melhores Avaliados
              </button>

              {priceBrackets.map((pb) => {
                const isSelected = maxPriceFilter === pb.max;
                return (
                  <button
                    key={pb.max}
                    type="button"
                    onClick={() => setMaxPriceFilter(isSelected ? null : pb.max)}
                    style={{
                      ...styles.miniChipBtn,
                      backgroundColor: isSelected ? "rgba(108, 92, 231, 0.12)" : "transparent",
                      color: isSelected ? "var(--accent)" : "var(--text-muted)",
                      borderColor: isSelected ? "var(--accent)" : "var(--border)",
                      fontWeight: isSelected ? 700 : 500,
                    }}
                  >
                    {pb.label}
                  </button>
                );
              })}

              {(activePlatform !== "ALL" || maxPriceFilter !== null || activeSort !== "price_asc") && (
                <button
                  type="button"
                  onClick={() => {
                    setActivePlatform("ALL");
                    setMaxPriceFilter(null);
                    setActiveSort("price_asc");
                  }}
                  style={styles.clearFiltersBtn}
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          </div>
        )}

        {/* Grid de Ofertas Modular com Colapso Automático de Desempenho */}
        {msg.results && msg.results.length > 0 && (
          <div style={styles.gridContainer}>
            {!isLatest && (
              <button
                onClick={() => setIsExpanded((prev) => !prev)}
                style={styles.collapseToggleBtn}
              >
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                <span>
                  {isExpanded
                    ? `Ocultar ${filteredResults.length} ofertas da busca "${msg.meta?.query || ""}"`
                    : `Ver ${filteredResults.length} ofertas de "${msg.meta?.query || ""}"`}
                </span>
              </button>
            )}

            {isExpanded && (
              <ListingGrid
                results={filteredResults}
                warnings={msg.warnings}
                favorites={favorites}
                comparedItems={comparedItems}
                onToggleFavorite={onToggleFavorite}
                onToggleCompare={onToggleCompare}
                onOpenComparisonModal={onOpenComparisonModal}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  messageWrapper: {
    display: "flex",
    gap: "14px",
    width: "100%",
    animation: "fadeInUp 0.3s ease-out",
  },
  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    backgroundColor: "rgba(108, 92, 231, 0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid var(--border)",
    flexShrink: 0,
    marginTop: "2px",
  },
  messageBubbleContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    flex: 1,
    minWidth: 0,
  },
  messageBubble: {
    padding: "14px 18px",
    borderRadius: "var(--radius-lg)",
    fontSize: "14px",
    lineHeight: "1.6",
    color: "var(--text-primary)",
    maxWidth: "100%",
    boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
  },
  messageText: {
    whiteSpace: "pre-wrap" as const,
  },
  loadingDots: {
    display: "flex",
    gap: "5px",
    marginTop: "8px",
  },
  dot: {
    width: "6px",
    height: "6px",
    backgroundColor: "var(--accent)",
    borderRadius: "50%",
    animation: "typingBounce 1.4s infinite ease-in-out",
    display: "inline-block",
  },
  searchMetaCard: {
    marginTop: "10px",
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "6px",
    paddingTop: "10px",
    borderTop: "1px solid var(--border)",
  },
  metaBadge: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
    backgroundColor: "var(--bg-primary)",
    padding: "3px 9px",
    borderRadius: "20px",
    color: "var(--text-secondary)",
    border: "1px solid var(--border)",
  },
  refinementContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "100%",
    padding: "4px 0",
  },
  refinementHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  refinementTitle: {
    fontSize: "12px",
    fontWeight: 700,
    color: "var(--text-secondary)",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  chipsScrollRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    overflowX: "auto",
    paddingBottom: "2px",
  },
  chipBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    border: "1px solid var(--border)",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.15s ease",
  },
  chipLogo: {
    width: "14px",
    height: "14px",
    borderRadius: "3px",
    objectFit: "contain",
  },
  chipsSecondaryRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    overflowX: "auto",
    paddingBottom: "2px",
  },
  subFilterLabel: {
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--text-muted)",
    whiteSpace: "nowrap",
  },
  miniChipBtn: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 10px",
    borderRadius: "14px",
    fontSize: "11px",
    border: "1px solid var(--border)",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.15s ease",
  },
  clearFiltersBtn: {
    fontSize: "11px",
    color: "#e74c3c",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    padding: "4px 8px",
    whiteSpace: "nowrap",
  },
  gridContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    width: "100%",
  },
  collapseToggleBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    alignSelf: "flex-start",
    backgroundColor: "var(--bg-secondary)",
    color: "var(--text-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "20px",
    padding: "6px 14px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "var(--transition)",
    boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
  },
};

export default ChatMessageItem;
