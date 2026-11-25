import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { colors, haptic } from '../theme/tokens';
import { loadSavedCreds, useAuth } from '../store/useAuth';
import { Icon } from '../components/Icons';
import { Banner, Card, PrimaryButton, TextField } from '../components/ui';

// Alturas dos prédios do skyline de NY
const SKYLINE = [38, 62, 46, 90, 54, 120, 70, 44, 84, 58, 100, 40, 66, 50];

export function LoginScreen() {
  const { login, error, attemptsLeft, loading, resetLock } = useAuth();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [forgotTip, setForgotTip] = useState(false);

  useEffect(() => {
    const saved = loadSavedCreds();
    if (!saved) return;
    setUser(saved.user);
    setPass(saved.pass);
    setRemember(true);
  }, []);

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (loading || attemptsLeft <= 0) return;
    const ok = await login(user, pass, remember);
    if (!ok) haptic([35, 35, 35]);
  };

  const fillDemo = () => {
    setUser('mj');
    setPass('peter123');
    setForgotTip(false);
  };

  return (
    <div className="pt-screen pt-login-screen">
      <div className="pt-login-scroll">
        <div className="pt-login-top">
          <div className="pt-logo">
            <Icon name="my-location" size={32} color={colors.text} />
          </div>
          <h1 className="pt-login-title">Peter Tracker</h1>
          <p className="pt-login-subtitle">SEMPRE UM PASSO À FRENTE</p>
        </div>

        <form onSubmit={submit}>
          <Card className="pt-login-card">
            {error && <Banner icon="error" text={error} />}

            <TextField
              icon="person"
              placeholder="Usuário"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="username"
              error={!!error}
            />

            <TextField
              icon="lock"
              placeholder="Senha"
              type={show ? 'text' : 'password'}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete="current-password"
              error={!!error}
              right={
                <button
                  type="button"
                  className="pt-inline-icon-btn"
                  onClick={() => setShow(!show)}
                  aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  <Icon name={show ? 'visibility-off' : 'visibility'} size={20} color={colors.textMuted} />
                </button>
              }
            />

            {error && (
              <div className="pt-attempts-row">
                <span className="pt-attempts">{attemptsLeft} de 5 tentativas restantes</span>
                {attemptsLeft <= 0 && (
                  <button type="button" className="pt-link-btn" onClick={resetLock}>
                    Desbloquear demo
                  </button>
                )}
              </div>
            )}

            <div className="pt-login-row">
              <button
                type="button"
                role="checkbox"
                aria-checked={remember}
                className="pt-check-btn"
                onClick={() => setRemember(!remember)}
              >
                <Icon
                  name={remember ? 'check-box' : 'check-box-outline-blank'}
                  size={22}
                  color={remember ? colors.blue : colors.textMuted}
                />
                <span className="pt-small">Lembrar senha</span>
              </button>

              <button
                type="button"
                className="pt-link-btn"
                onClick={() => setForgotTip((v) => !v)}
              >
                Esqueci a senha
              </button>
            </div>

            {forgotTip && (
              <div className="pt-forgot-tip">
                <span>
                  Acesso de demonstração: <strong>mj</strong> / <strong>peter123</strong>
                </span>
                <button type="button" className="pt-link-btn" onClick={fillDemo}>
                  Preencher
                </button>
              </div>
            )}

            <PrimaryButton
              type="submit"
              title={loading ? 'ENTRANDO…' : error ? 'TENTAR NOVAMENTE' : 'ENTRAR'}
              disabled={loading || attemptsLeft <= 0}
            />
          </Card>
        </form>

        <p className="pt-hint">
          Demo: usuário &quot;mj&quot;, senha &quot;peter123&quot; ·{' '}
          <button type="button" className="pt-hint-fill" onClick={fillDemo}>
            preencher rápido
          </button>
        </p>

        <div className="pt-skyline" aria-hidden="true">
          {SKYLINE.map((h, i) => (
            <div key={i} className="pt-building" style={{ height: h }} />
          ))}
        </div>
      </div>
    </div>
  );
}
