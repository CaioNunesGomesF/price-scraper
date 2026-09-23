import React from "react";
import Chart from "react-apexcharts";
import { X, TrendingUp, Search, Layers, ShoppingBag, Award, Flame, PieChart, Store } from "lucide-react";

interface AnalyticsDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsDashboardModal: React.FC<AnalyticsDashboardModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // 1. Termos Mais Pesquisados (Horizontal Bar Chart)
  const topSearchesOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        horizontal: true,
        barHeight: "55%",
      },
    },
    colors: ["#6c5ce7"],
    dataLabels: { enabled: true, style: { fontSize: "11px", colors: ["#ffffff"] } },
    xaxis: {
      categories: ["iPhone 13", "Conta Valorant", "Roblox", "Honda Civic", "Relógio Smartwatch", "MacBook M2"],
      labels: { style: { colors: "var(--text-secondary)", fontSize: "11px" } },
    },
    yaxis: {
      labels: { style: { colors: "var(--text-primary)", fontSize: "12px", fontWeight: 600 } },
    },
    grid: { strokeDashArray: 4, borderColor: "var(--border)" },
    tooltip: { theme: "light" },
  };

  const topSearchesSeries = [
    {
      name: "Total de Buscas",
      data: [142, 118, 95, 82, 74, 56],
    },
  ];

  // 2. Distribuição por Categoria (Donut Chart)
  const categoryDonutOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    },
    labels: ["Eletrônicos", "Jogos & Contas", "Veículos", "Imóveis", "Outros"],
    colors: ["#6c5ce7", "#00cec9", "#8c52ff", "#f39c12", "#64748b"],
    legend: {
      position: "bottom",
      labels: { colors: "#1e2b23" },
      fontSize: "12px",
    },
    dataLabels: { enabled: true, formatter: (val: number) => `${val.toFixed(0)}%` },
    stroke: { width: 2, colors: ["#ffffff"] },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Categorias",
              fontSize: "12px",
              color: "#4d5c52",
              formatter: () => "5 Ativas",
            },
          },
        },
      },
    },
  };

  const categoryDonutSeries = [42, 28, 16, 8, 6];

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
    <div style={styles.overlay} className="modal-overlay-fade" onClick={onClose}>
      <div style={styles.modalContent} className="modal-content-pop" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.titleContainer}>
            <div style={styles.iconRing}>
              <TrendingUp size={18} color="var(--accent)" />
            </div>
            <div>
              <h2 style={styles.headerTitle}>Painel de Analytics & Tendências</h2>
              <span style={styles.headerSubtitle}>Métricas em tempo real sobre pesquisas e marketplaces</span>
            </div>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={18} color="var(--text-secondary)" />
          </button>
        </div>

        {/* Dashboard Body */}
        <div style={styles.body}>
          {/* KPI Summary Cards */}
          <div style={styles.kpiGrid}>
            <div style={styles.kpiCard}>
              <div style={styles.kpiIconWrapper}>
                <Search size={16} color="var(--accent)" />
              </div>
              <div>
                <span style={styles.kpiLabel}>Total de Pesquisas</span>
                <div style={styles.kpiValue}>1.420</div>
              </div>
            </div>

            <div style={styles.kpiCard}>
              <div style={styles.kpiIconWrapper}>
                <Layers size={16} color="var(--accent)" />
              </div>
              <div>
                <span style={styles.kpiLabel}>Categoria Mais Buscada</span>
                <div style={styles.kpiValue}>Eletrônicos (42%)</div>
              </div>
            </div>

            <div style={styles.kpiCard}>
              <div style={styles.kpiIconWrapper}>
                <ShoppingBag size={16} color="var(--accent)" />
              </div>
              <div>
                <span style={styles.kpiLabel}>Ofertas Indexadas</span>
                <div style={styles.kpiValue}>1.330</div>
              </div>
            </div>

            <div style={styles.kpiCard}>
              <div style={styles.kpiIconWrapper}>
                <Award size={16} color="var(--success)" />
              </div>
              <div>
                <span style={styles.kpiLabel}>Maior Plataforma</span>
                <div style={styles.kpiValue}>Mercado Livre (34%)</div>
              </div>
            </div>
          </div>

          {/* ApexCharts Grid */}
          <div style={styles.chartsGrid}>
            {/* Chart 1: Top Termos */}
            <div style={styles.chartBox}>
              <h3 style={styles.chartBoxTitle}>
                <Flame size={16} color="#e74c3c" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }} />
                Termos Mais Pesquisados
              </h3>
              <div style={{ width: "100%", height: 220 }}>
                <Chart options={topSearchesOptions} series={topSearchesSeries} type="bar" height="100%" />
              </div>
            </div>

            {/* Chart 2: Categorias Donut */}
            <div style={styles.chartBox}>
              <h3 style={styles.chartBoxTitle}>
                <PieChart size={16} color="var(--accent)" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }} />
                Distribuição por Categoria
              </h3>
              <div style={{ width: "100%", height: 220 }}>
                <Chart options={categoryDonutOptions} series={categoryDonutSeries} type="donut" height="100%" />
              </div>
            </div>

            {/* Chart 3: Volume por Plataforma */}
            <div style={styles.chartBox}>
              <h3 style={styles.chartBoxTitle}>
                <Store size={16} color="var(--accent)" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }} />
                Volume de Ofertas por Marketplace
              </h3>
              <div style={{ width: "100%", height: 220 }}>
                <Chart options={platformColumnOptions} series={platformColumnSeries} type="bar" height="100%" />
              </div>
            </div>

            {/* Chart 4: Volume de Consultas em Tempo Real */}
            <div style={styles.chartBox}>
              <h3 style={styles.chartBoxTitle}>
                <TrendingUp size={16} color="var(--success)" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }} />
                Volume de Consultas (24 Horas)
              </h3>
              <div style={{ width: "100%", height: 220 }}>
                <Chart options={queryTrendOptions} series={queryTrendSeries} type="area" height="100%" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button style={styles.closeModalBtn} onClick={onClose}>
            Fechar Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 250,
    padding: "20px",
  },
  modalContent: {
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    width: "100%",
    maxWidth: "920px",
    maxHeight: "92vh",
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
    boxShadow: "0 24px 50px -12px rgba(0, 0, 0, 0.3)",
  },
  header: {
    padding: "16px 24px",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "var(--bg-primary)",
    flexShrink: 0,
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  iconRing: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "rgba(108, 92, 231, 0.12)",
    border: "1px solid rgba(108, 92, 231, 0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: "16px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  headerSubtitle: {
    fontSize: "12px",
    color: "var(--text-secondary)",
  },
  closeBtn: {
    background: "none",
    border: "none",
    padding: "6px",
    cursor: "pointer",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    padding: "24px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
  },
  kpiCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 16px",
    backgroundColor: "var(--bg-primary)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
  },
  kpiIconWrapper: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    backgroundColor: "var(--bg-secondary)",
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
    fontWeight: 500,
  },
  kpiValue: {
    fontSize: "15px",
    fontWeight: 800,
    color: "var(--text-primary)",
    marginTop: "2px",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "20px",
  },
  chartBox: {
    backgroundColor: "var(--bg-primary)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    padding: "18px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  chartBoxTitle: {
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  footer: {
    padding: "14px 24px",
    borderTop: "1px solid var(--border)",
    backgroundColor: "var(--bg-primary)",
    display: "flex",
    justifyContent: "flex-end",
    flexShrink: 0,
  },
  closeModalBtn: {
    backgroundColor: "var(--accent)",
    color: "#ffffff",
    border: "none",
    borderRadius: "20px",
    padding: "8px 20px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default AnalyticsDashboardModal;
