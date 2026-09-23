import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { TrendingUp, Search, Layers, ShoppingBag, Loader2 } from "lucide-react";
import { searchApi, TopSearch } from "../../../services/searchApi";

export const AnalyticsDashboardView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [topSearches, setTopSearches] = useState<TopSearch[]>([]);
  const [categoriesData, setCategoriesData] = useState<Record<string, number>>({});

  useEffect(() => {
    Promise.all([
      searchApi.getTopSearches(10),
      searchApi.getCategories()
    ]).then(([topRes, catRes]) => {
      setTopSearches(topRes.data || []);
      setCategoriesData(catRes.data || {});
    }).catch(err => {
      console.error("Erro ao carregar analytics", err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", padding: "100px 0" }}>
      <Loader2 size={40} className="animate-spin" color="var(--primary)" />
    </div>;
  }

  const topSearchesLabels = topSearches.map(t => t.query);
  const topSearchesValues = topSearches.map(t => t.searchCount);

  const categoryLabels = Object.keys(categoriesData);
  const categoryValues = Object.values(categoriesData);

  // 1. Termos Mais Pesquisados (Horizontal Bar Chart)
  const topSearchesOptions: ApexCharts.ApexOptions = {
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "'Plus Jakarta Sans', sans-serif" },
    plotOptions: { bar: { borderRadius: 6, horizontal: true, barHeight: "55%" } },
    colors: ["#5a7a6a"],
    dataLabels: { enabled: true, style: { fontSize: "11px", colors: ["#ffffff"] } },
    xaxis: { categories: topSearchesLabels, labels: { style: { colors: "#4d5c52", fontSize: "11px" } } },
    yaxis: { labels: { style: { colors: "#1e2b23", fontSize: "12px", fontWeight: 600 } } },
    grid: { strokeDashArray: 4, borderColor: "#d2dbd5" },
    tooltip: { theme: "light" },
  };

  const topSearchesSeries = [{ name: "Total de Buscas", data: topSearchesValues }];

  // 2. Distribuição por Categoria (Donut Chart)
  const categoryDonutOptions: ApexCharts.ApexOptions = {
    chart: { type: "donut", fontFamily: "'Plus Jakarta Sans', sans-serif" },
    labels: categoryLabels,
    colors: ["#5a7a6a", "#00cec9", "#8c52ff", "#f39c12", "#64748b"],
    legend: { position: "bottom", labels: { colors: "#1e2b23" }, fontSize: "12px" },
    dataLabels: { enabled: true, formatter: (val: number) => `${val.toFixed(0)}%` },
    stroke: { width: 2, colors: ["#ffffff"] },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: { show: true, label: "Categorias", fontSize: "12px", color: "#4d5c52", formatter: () => `${categoryLabels.length} Ativas` },
          },
        },
      },
    },
  };

  const categoryDonutSeries = categoryValues;


  // 3. Volume de Anúncios por Plataforma (Column Chart)
  const platformColumnOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "45%",
        distributed: true,
      },
    },
    colors: ["#ffd800", "#8c52ff", "#ff9900", "#00cec9"],
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: {
      categories: ["Mercado Livre", "OLX Brasil", "Amazon", "GGMax"],
      labels: { style: { colors: "#1e2b23", fontSize: "11px", fontWeight: 600 } },
    },
    yaxis: {
      labels: { style: { colors: "#4d5c52", fontSize: "11px" } },
    },
    grid: { strokeDashArray: 4, borderColor: "#d2dbd5" },
    tooltip: { theme: "light" },
  };

  const platformColumnSeries = [
    {
      name: "Ofertas Indexadas",
      data: [450, 380, 290, 210],
    },
  ];

  // 4. Volume de Consultas em Tempo Real (Area Chart with Gradient)
  const queryTrendOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    },
    colors: ["#5a7a6a"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    stroke: { curve: "smooth", width: 2.5 },
    xaxis: {
      categories: ["00h", "04h", "08h", "12h", "16h", "20h", "Agora"],
      labels: { style: { colors: "#4d5c52", fontSize: "11px" } },
    },
    yaxis: {
      labels: { style: { colors: "#4d5c52", fontSize: "11px" } },
    },
    grid: { strokeDashArray: 4, borderColor: "#d2dbd5" },
    tooltip: { theme: "light" },
  };

  const queryTrendSeries = [
    {
      name: "Requisições por hora",
      data: [25, 12, 65, 140, 185, 120, 95],
    },
  ];

  return (
    <div style={styles.viewContainer}>
      <div style={styles.innerWrapper}>
        {/* Page Banner Header */}
        <div
          style={{
            ...styles.bannerHeader,
            animation: "cardPopIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both",
          }}
        >
          <div style={styles.iconRing}>
            <TrendingUp size={22} color="var(--accent)" />
          </div>
          <div>
            <h2 style={styles.pageTitle}>Dashboard de Analytics & Tendências</h2>
            <p style={styles.pageSubtitle}>
              Métricas em tempo real sobre termos mais buscados, volumes de mercado e estatísticas dos crawlers.
            </p>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div
          style={{
            ...styles.kpiGrid,
            animation: "cardPopIn 0.45s 0.1s cubic-bezier(0.34, 1.56, 0.64, 1) both",
          }}
        >
          <div style={styles.kpiCard} className="product-card-hover">
            <div style={styles.kpiIconWrapper}>
              <Search size={18} color="var(--accent)" />
            </div>
            <div>
              <span style={styles.kpiLabel}>Total de Pesquisas (Mês)</span>
              <div style={styles.kpiValue}>1.420</div>
            </div>
          </div>

          <div style={styles.kpiCard} className="product-card-hover">
            <div style={styles.kpiIconWrapper}>
              <Layers size={18} color="var(--accent)" />
            </div>
            <div>
              <span style={styles.kpiLabel}>Categoria Líder</span>
              <div style={styles.kpiValue}>Eletrônicos (42%)</div>
            </div>
          </div>

          <div style={styles.kpiCard} className="product-card-hover">
            <div style={styles.kpiIconWrapper}>
              <ShoppingBag size={18} color="var(--accent)" />
            </div>
            <div>
              <span style={styles.kpiLabel}>Ofertas Indexadas</span>
              <div style={styles.kpiValue}>1.330</div>
            </div>
          </div>

          <div style={styles.kpiCard} className="product-card-hover">
            <div style={{ ...styles.kpiIconWrapper, backgroundColor: "rgba(255, 216, 0, 0.2)", border: "1px solid rgba(255, 216, 0, 0.4)" }}>
              <img
                src="/platforms/mercadoLivre.png"
                alt="Mercado Livre Logo"
                style={{ width: "20px", height: "20px", borderRadius: "4px", objectFit: "contain" }}
              />
            </div>
            <div>
              <span style={styles.kpiLabel}>Marketplace Mais Ativo</span>
              <div style={{ ...styles.kpiValue, display: "flex", alignItems: "center", gap: "6px" }}>
                <span>Mercado Livre (34%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ApexCharts 2x2 Grid */}
        <div
          style={{
            ...styles.chartsGrid,
            animation: "cardPopIn 0.45s 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both",
          }}
        >
          {/* Chart 1: Top Termos */}
          <div style={styles.chartBox} className="product-card-hover">
            <h3 style={styles.chartBoxTitle}>Termos Mais Pesquisados</h3>
            <div style={{ width: "100%", height: 260 }}>
              <Chart options={topSearchesOptions} series={topSearchesSeries} type="bar" height="100%" />
            </div>
          </div>

          {/* Chart 2: Categorias Donut */}
          <div style={styles.chartBox} className="product-card-hover">
            <h3 style={styles.chartBoxTitle}>Distribuição por Categoria</h3>
            <div style={{ width: "100%", height: 260 }}>
              <Chart options={categoryDonutOptions} series={categoryDonutSeries} type="donut" height="100%" />
            </div>
          </div>

          {/* Chart 3: Volume por Plataforma */}
          <div style={styles.chartBox} className="product-card-hover">
            <h3 style={styles.chartBoxTitle}>Volume de Anúncios por Marketplace</h3>
            <div style={{ width: "100%", height: 260 }}>
              <Chart options={platformColumnOptions} series={platformColumnSeries} type="bar" height="100%" />
            </div>
          </div>

          {/* Chart 4: Volume de Consultas em Tempo Real */}
          <div style={styles.chartBox} className="product-card-hover">
            <h3 style={styles.chartBoxTitle}>Volume de Consultas (24 Horas)</h3>
            <div style={{ width: "100%", height: 260 }}>
              <Chart options={queryTrendOptions} series={queryTrendSeries} type="area" height="100%" />
            </div>
          </div>
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
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "14px",
  },
  kpiCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
  },
  kpiIconWrapper: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    backgroundColor: "var(--bg-primary)",
    border: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  kpiLabel: {
    display: "block",
    fontSize: "11px",
    color: "var(--text-secondary)",
    fontWeight: 600,
  },
  kpiValue: {
    fontSize: "16px",
    fontWeight: 800,
    color: "var(--text-primary)",
    marginTop: "2px",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  chartBox: {
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "20px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "14px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
  },
  chartBoxTitle: {
    fontSize: "15px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
};

export default AnalyticsDashboardView;
