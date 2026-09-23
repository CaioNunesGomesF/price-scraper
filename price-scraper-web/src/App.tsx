import React, { useState, useEffect, useRef } from "react";
import {
  searchApi,
  type Category,
  type Platform,
  type SortBy,
} from "./services/searchApi";
import { Search, Home } from "lucide-react";
import { WelcomeHero } from "./features/search/components/WelcomeHero";
import { FilterStrip } from "./features/search/components/FilterStrip";
import { Header } from "./features/search/components/Header";
import { IntegratedPlatformsModal } from "./features/search/components/IntegratedPlatformsModal";
import { AnalyticsDashboardView } from "./features/analytics/components/AnalyticsDashboardView";
import { FavoritesView } from "./features/favorites/components/FavoritesView";
import { StoresCreditsView } from "./features/sources/components/StoresCreditsView";
import { ProductDetailsModal } from "./features/search/components/ProductDetailsModal";
import { ProductComparisonModal } from "./features/comparison/components/ProductComparisonModal";
import { AuthModal, type UserProfile } from "./features/auth/components/AuthModal";
import { ChatMessageItem, type ChatMessage } from "./features/search/components/ChatMessageItem";
import { ListingItem } from "./services/searchApi";
import { favoritesApi } from "./services/favoritesApi";

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "system",
      text: "",
      timestamp: new Date(),
    },
  ]);
  const [query, setQuery] = useState("");
  
  const [category, setCategory] = useState<Category>("OUTROS");
  const [platform, setPlatform] = useState<Platform>("ALL");
  const [sortBy, setSortBy] = useState<SortBy>("price_asc");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState<"search" | "analytics" | "favorites" | "sources">("search");
  const [selectedFavProduct, setSelectedFavProduct] = useState<ListingItem | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [comparedItems, setComparedItems] = useState<ListingItem[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem("ps_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (userProfile: UserProfile) => {
    setUser(userProfile);
    try {
      localStorage.setItem("price_scraper_user", JSON.stringify(userProfile));
    } catch {}
  };

  const handleLogout = () => {
    setUser(null);
    setFavorites([]);
    localStorage.removeItem("ps_auth_token");
    localStorage.removeItem("ps_user");
  };

  const [favorites, setFavorites] = useState<ListingItem[]>([]);

  useEffect(() => {
    if (user) {
      favoritesApi.getFavorites().then(setFavorites).catch(console.error);
    } else {
      setFavorites([]);
    }
  }, [user]);

  const getItemKey = (item: ListingItem) => item.id || item.externalId || item.url;

  const toggleFavorite = (item: ListingItem) => {
    setFavorites((prev) => {
      const key = getItemKey(item);
      const exists = prev.some((f) => getItemKey(f) === key);
      const next = exists ? prev.filter((f) => getItemKey(f) !== key) : [...prev, item];
      try {
        localStorage.setItem("price_scraper_favorites", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const toggleCompare = (item: ListingItem) => {
    setComparedItems((prev) => {
      const key = getItemKey(item);
      const exists = prev.some((c) => getItemKey(c) === key);
      if (exists) {
        return prev.filter((c) => getItemKey(c) !== key);
      } else {
        if (prev.length >= 4) {
          alert("Você pode comparar no máximo 4 ofertas simultaneamente.");
          return prev;
        }
        return [...prev, item];
      }
    });
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
    }, 220);
  };

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleNewSearch = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const currentQuery = query.trim();
    const userMsgId = Math.random().toString();
    const systemMsgId = Math.random().toString();

    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: "user",
        text: currentQuery,
        timestamp: new Date(),
      },
      {
        id: systemMsgId,
        sender: "system",
        text: `Consultando as fontes e processando dados para "${currentQuery}"...`,
        timestamp: new Date(),
        isSearching: true,
      },
    ]);

    setQuery("");

    try {
      const res = await searchApi.search({
        q: currentQuery,
        category,
        platform,
        sortBy,
        minPrice: minPrice === "" ? undefined : minPrice,
        maxPrice: maxPrice === "" ? undefined : maxPrice,
      });

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === systemMsgId) {
            return {
              ...msg,
              isSearching: false,
              text: `Busca finalizada! Encontrei ${res.total} ofertas para "${currentQuery}".`,
              results: res.results || [],
              warnings: res.warnings || [],
              meta: {
                fromCache: res.fromCache,
                total: res.total,
                category: res.category,
                query: currentQuery,
              },
            };
          }
          return msg;
        })
      );
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === systemMsgId) {
            return {
              ...msg,
              isSearching: false,
              text: `Erro ao obter dados: ${err.message}`,
            };
          }
          return msg;
        })
      );
    }
  };

  const isWelcomeState = messages.length === 1;

  const renderSearchForm = () => (
    <form onSubmit={handleSearch} style={styles.searchForm}>
      <FilterStrip
        category={category}
        setCategory={setCategory}
        platform={platform}
        setPlatform={setPlatform}
        sortBy={sortBy}
        setSortBy={setSortBy}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
      />

      <div style={styles.inputContainer}>
        {!isWelcomeState && (
          <button
            type="button"
            onClick={handleNewSearch}
            style={styles.homeInputBtn}
            title="Voltar ao Início"
          >
            <Home size={16} color="var(--accent)" />
          </button>
        )}
        <input
          type="text"
          placeholder="Pesquise produtos em tempo real (ex: iPhone 13, notebook, conta valorant...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.mainInput}
        />
        <button type="submit" style={styles.sendBtn}>
          <Search size={18} color="#fff" />
        </button>
      </div>
    </form>
  );

  return (
    <div style={styles.appContainer}>
      {/* Background Blobs */}
      <div className="global-blob blob-1" />
      <div className="global-blob blob-2" />
      <div className="global-blob blob-3" />
      <div className="global-grid-bg" />

      <div style={styles.chatArea}>
        {/* Header Component */}
        <Header
          activeTab={activeTab}
          favoritesCount={favorites.length}
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
          onTabChange={setActiveTab}
          onNewSearch={handleNewSearch}
        />

        {activeTab === "analytics" ? (
          <div key="analytics" className="tab-view-transition">
            <AnalyticsDashboardView />
          </div>
        ) : activeTab === "favorites" ? (
          <div key="favorites" className="tab-view-transition">
            <FavoritesView
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onSelectProduct={(prod) => setSelectedFavProduct(prod)}
            />
          </div>
        ) : activeTab === "sources" ? (
          <div key="sources" className="tab-view-transition">
            <StoresCreditsView />
          </div>
        ) : (
          <div key="search" className="tab-view-transition">
            {/* Messages & Workspace Area */}
            <div
              ref={messagesContainerRef}
              style={{
                ...styles.messagesContainer,
                ...(isWelcomeState
                  ? { display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: "12vh" }
                  : { paddingBottom: "140px" }),
              }}
            >
              <div
                style={{
                  ...styles.messagesInner,
                  ...(isWelcomeState
                    ? {
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        flex: 1,
                        gap: "32px",
                      }
                    : {}),
                }}
              >
                {isWelcomeState ? (
                  <>
                    <WelcomeHero />
                    <div
                      className="hero-cta-input-wrapper hero-container-mobile"
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        maxWidth: "660px",
                        filter: "drop-shadow(0 0 24px rgba(108,92,231,0.15))",
                      }}
                    >
                      {renderSearchForm()}
                    </div>

                    {/* Overlapping Platform Logos */}
                    <div
                      style={{ ...styles.platformLogoWrapper, marginTop: "64px" }}
                      onClick={() => setIsModalOpen(true)}
                    >
                      <span style={styles.platformLogoText}>Buscando em:</span>
                      <div style={styles.platformLogoStack}>
                        <span className="platform-stack-item-wrapper">
                          <img
                            src="/platforms/mercadoLivre.png"
                            alt="Mercado Livre"
                            className="platform-stack-item"
                            style={{ ...styles.platformCircle, backgroundColor: "#ffd800", zIndex: 3 }}
                            title="Mercado Livre"
                          />
                        </span>
                        <span className="platform-stack-item-wrapper">
                          <img
                            src="/platforms/olx.png"
                            alt="OLX"
                            className="platform-stack-item"
                            style={{ ...styles.platformCircle, backgroundColor: "#8c52ff", zIndex: 2 }}
                            title="OLX"
                          />
                        </span>
                        <span className="platform-stack-item-wrapper">
                          <img
                            src="/platforms/amazon.png"
                            alt="Amazon"
                            className="platform-stack-item"
                            style={{ ...styles.platformCircle, backgroundColor: "#ff9900", zIndex: 1 }}
                            title="Amazon"
                          />
                        </span>
                        <span className="platform-stack-item-wrapper">
                          <div
                            className="platform-stack-item"
                            style={{
                              ...styles.platformCircle,
                              backgroundColor: "var(--bg-secondary)",
                              border: "1.5px solid var(--border)",
                              color: "var(--accent)",
                            }}
                            title="GGMax e outros"
                          >
                            +
                          </div>
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {messages.slice(1).map((msg, idx, arr) => (
                      <ChatMessageItem
                        key={msg.id}
                        msg={msg}
                        isLatest={idx === arr.length - 1}
                        favorites={favorites}
                        comparedItems={comparedItems}
                        onToggleFavorite={toggleFavorite}
                        onToggleCompare={toggleCompare}
                        onOpenComparisonModal={() => setIsComparisonModalOpen(true)}
                      />
                    ))}
                    <div style={{ height: "220px", width: "100%", flexShrink: 0, pointerEvents: "none" }} />
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Bottom Search Controls when viewing results */}
            {!isWelcomeState && (
              <div className="controls-area-mobile"
              style={styles.controlsArea}>
                {renderSearchForm()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Integrated Platforms Modal Component */}
      <IntegratedPlatformsModal
        isOpen={isModalOpen}
        isClosing={isClosing}
        onClose={handleCloseModal}
      />

      {/* Selected Favorite Product Details Modal */}
      <ProductDetailsModal
        item={selectedFavProduct}
        isFavorite={selectedFavProduct ? favorites.some((f) => getItemKey(f) === getItemKey(selectedFavProduct)) : false}
        onToggleFavorite={toggleFavorite}
        onClose={() => setSelectedFavProduct(null)}
      />

      {/* Product Comparison Side-by-Side Modal */}
      {isComparisonModalOpen && (
        <ProductComparisonModal
          items={comparedItems}
          onClose={() => setIsComparisonModalOpen(false)}
          onRemoveItem={toggleCompare}
        />
      )}

      {/* Auth Modal Component (Login / Signup) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  appContainer: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    backgroundColor: "var(--bg-primary)",
    position: "relative",
  },
  chatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    height: "100%",
    overflow: "hidden",
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 20px 180px",
    boxSizing: "border-box" as const,
    display: "flex",
    justifyContent: "center",
  },
  messagesInner: {
    width: "100%",
    maxWidth: "820px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",
  },
  controlsArea: {
    position: "absolute",
    bottom: "24px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "calc(100% - 32px)",
    maxWidth: "760px",
    padding: "8px 12px",
    backgroundColor: "rgba(255, 255, 255, 0.88)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    borderRadius: "24px",
    border: "1px solid rgba(210, 219, 213, 0.8)",
    boxShadow: "0 12px 36px -4px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.04)",
    display: "flex",
    justifyContent: "center",
    zIndex: 50,
  },
  searchForm: {
    width: "100%",
    maxWidth: "820px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    alignSelf: "stretch",
  },
  inputContainer: {
    display: "flex",
    width: "100%",
    backgroundColor: "var(--bg-input)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-xl)",
    padding: "4px 6px 4px 18px",
    alignItems: "center",
    outline: "none",
  },
  mainInput: {
    flex: 1,
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    boxShadow: "none",
    color: "var(--text-primary)",
    fontSize: "14px",
    height: "44px",
  },
  homeInputBtn: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    backgroundColor: "rgba(90, 122, 106, 0.12)",
    border: "1px solid rgba(90, 122, 106, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    cursor: "pointer",
    marginRight: "6px",
    transition: "var(--transition)",
  },
  sendBtn: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "var(--btn-gray)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "var(--transition)",
    border: "none",
    cursor: "pointer",
  },
  platformLogoWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "4px",
    animation: "fadeInUp 0.6s ease-out",
    cursor: "pointer",
  },
  platformLogoText: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    fontWeight: 500,
  },
  platformLogoStack: {
    display: "flex",
    alignItems: "center",
  },
  platformCircle: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 800,
    marginLeft: "-8px",
    border: "2.5px solid var(--bg-primary)",
    userSelect: "none",
  },
};
