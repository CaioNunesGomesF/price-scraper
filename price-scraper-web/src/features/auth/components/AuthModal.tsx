import React, { useState } from "react";
import { authApi } from "../../../services/authApi";
import { X, Lock, Mail, User as UserIcon, ArrowRight, ShieldCheck } from "lucide-react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider: "google" | "email";
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        id: "usr_google_123",
        name: "Caio Nunes",
        email: "caio.nunes@example.com",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
        provider: "google",
      });
      onClose();
    }, 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (mode === "signup" && !name) return;

    setIsLoading(true);
    try {
      let result;
      if (mode === "login") {
        result = await authApi.login(email, password);
      } else {
        result = await authApi.register(name, email, password);
      }
      
      localStorage.setItem("ps_auth_token", result.token);
      localStorage.setItem("ps_user", JSON.stringify(result.user));
      onLoginSuccess({ ...result.user, provider: "email" });
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Erro na autenticação.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.overlay} className="modal-overlay-fade" onClick={onClose}>
      <div style={styles.modalContent} className="modal-content-pop modal-responsive" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={styles.header}>
          <div style={styles.brandRow}>
            <div style={styles.brandLogo}>PS</div>
            <span style={styles.brandTitle}>PriceScraper Account</span>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={18} color="var(--text-secondary)" />
          </button>
        </div>

        {/* Modal Body */}
        <div style={styles.body}>
          <h2 style={styles.title}>
            {mode === "login" ? "Acesse sua Conta" : "Crie sua Conta Grátis"}
          </h2>
          <p style={styles.subtitle}>
            {mode === "login"
              ? "Salve seus produtos favoritos e acompanhe a variação de preços em tempo real."
              : "Cadastre-se para ativar alertas de queda de preço e sincronizar suas buscas."}
          </p>

          {/* Social Google Login Button */}
          <button
            style={styles.googleBtn}
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="load-more-btn-hover"
          >
            <svg style={{ width: "18px", height: "18px" }} viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continuar com o Google</span>
          </button>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>ou com e-mail</span>
            <span style={styles.dividerLine} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            {mode === "signup" && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nome Completo</label>
                <div style={styles.inputWrapper}>
                  <UserIcon size={16} color="var(--text-secondary)" style={styles.inputIcon} />
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>
              </div>
            )}

            <div style={styles.inputGroup}>
              <label style={styles.label}>E-mail</label>
              <div style={styles.inputWrapper}>
                <Mail size={16} color="var(--text-secondary)" style={styles.inputIcon} />
                <input
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Senha</label>
              <div style={styles.inputWrapper}>
                <Lock size={16} color="var(--text-secondary)" style={styles.inputIcon} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <button type="submit" style={styles.submitBtn} disabled={isLoading}>
              <span>{isLoading ? "Processando..." : mode === "login" ? "Entrar na Conta" : "Criar Minha Conta"}</span>
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Toggle Mode */}
          <div style={styles.toggleFooter}>
            {mode === "login" ? (
              <span>
                Ainda não tem conta?{" "}
                <button style={styles.linkBtn} onClick={() => setMode("signup")}>
                  Cadastre-se grátis
                </button>
              </span>
            ) : (
              <span>
                Já possui uma conta?{" "}
                <button style={styles.linkBtn} onClick={() => setMode("login")}>
                  Faça login
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Security Badge */}
        <div style={styles.footerSecurity}>
          <ShieldCheck size={14} color="var(--success)" />
          <span>Conexão criptografada e segura de alta proteção</span>
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
    zIndex: 300,
    padding: "20px",
  },
  modalContent: {
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    width: "100%",
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
    boxShadow: "0 24px 50px -12px rgba(0, 0, 0, 0.3)",
  },
  header: {
    padding: "16px 20px",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "var(--bg-primary)",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  brandLogo: {
    width: "24px",
    height: "24px",
    borderRadius: "6px",
    backgroundColor: "var(--accent)",
    color: "#ffffff",
    fontSize: "11px",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    fontSize: "13px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  closeBtn: {
    background: "none",
    border: "none",
    padding: "4px",
    cursor: "pointer",
    borderRadius: "50%",
  },
  body: {
    padding: "24px",
    display: "flex",
    flexDirection: "column" as const,
  },
  title: {
    fontSize: "20px",
    fontWeight: 800,
    color: "var(--text-primary)",
    marginBottom: "6px",
  },
  subtitle: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    lineHeight: "1.5",
    marginBottom: "20px",
  },
  googleBtn: {
    width: "100%",
    height: "42px",
    borderRadius: "20px",
    backgroundColor: "var(--bg-primary)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    fontSize: "13px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    cursor: "pointer",
    transition: "var(--transition)",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    margin: "18px 0",
    gap: "10px",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "var(--border)",
  },
  dividerText: {
    fontSize: "11px",
    color: "var(--text-secondary)",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "14px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "5px",
  },
  label: {
    fontSize: "11px",
    fontWeight: 700,
    color: "var(--text-secondary)",
  },
  inputWrapper: {
    position: "relative" as const,
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute" as const,
    left: "12px",
  },
  input: {
    width: "100%",
    height: "40px",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    backgroundColor: "var(--bg-primary)",
    color: "var(--text-primary)",
    paddingLeft: "36px",
    paddingRight: "12px",
    fontSize: "13px",
    outline: "none",
  },
  submitBtn: {
    marginTop: "6px",
    width: "100%",
    height: "42px",
    borderRadius: "20px",
    backgroundColor: "var(--accent)",
    color: "#ffffff",
    border: "none",
    fontSize: "13px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
  },
  toggleFooter: {
    marginTop: "16px",
    textAlign: "center" as const,
    fontSize: "12px",
    color: "var(--text-secondary)",
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "var(--accent)",
    fontWeight: 700,
    cursor: "pointer",
    padding: 0,
    marginLeft: "4px",
    textDecoration: "underline",
  },
  footerSecurity: {
    padding: "10px 20px",
    backgroundColor: "var(--bg-primary)",
    borderTop: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    fontSize: "11px",
    color: "var(--text-secondary)",
  },
};

export default AuthModal;
