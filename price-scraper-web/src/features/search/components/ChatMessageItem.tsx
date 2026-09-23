import React, { useState, useEffect } from "react";
import { Search, Layers, Info, ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";
import { ListingItem } from "../../../services/searchApi";
import { ListingGrid } from "./ListingGrid";

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

  // Auto-collapse when new searches arrive if not latest
  useEffect(() => {
    setIsExpanded(isLatest);
  }, [isLatest]);

  return (
    <div
      style={{
        ...styles.messageWrapper,
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      {!isUser && (
        <div style={styles.avatar}>
          <Search size={14} color="var(--accent-light, #a29bfe)" />
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
                <span>{msg.meta.fromCache ? "Cache (30m)" : "Busca Direta"}</span>
              </div>
              <div style={styles.metaBadge}>
                <ShoppingBag size={11} />
                <span>{msg.meta.total} itens</span>
              </div>
            </div>
          )}
        </div>

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
                    ? `Ocultar ${msg.results.length} ofertas da busca "${msg.meta?.query || ""}"`
                    : `Ver ${msg.results.length} ofertas de "${msg.meta?.query || ""}" (Recolhidas para economizar memória)`}
                </span>
              </button>
            )}

            {isExpanded && (
              <ListingGrid
                results={msg.results}
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
    backgroundColor: "rgba(108,92,231,0.12)",
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
    gap: "14px",
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
    backgroundColor: "var(--accent-light, #a29bfe)",
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
