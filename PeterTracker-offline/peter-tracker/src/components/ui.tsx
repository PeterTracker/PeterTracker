import { useState } from 'react';
import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react';
import { colors } from '../theme/tokens';
import { hhmm } from '../store/usePeter';
import type { Message } from '../services/api';
import { Icon, type IconName } from './Icons';

export function PrimaryButton({
  title,
  icon,
  onPress,
  tone = 'red',
  disabled,
  type = 'button',
}: {
  title: string;
  icon?: IconName;
  onPress?: () => void;
  tone?: 'red' | 'blue' | 'surface';
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  const bg = { red: colors.red, blue: colors.blue, surface: colors.surface2 }[tone];
  return (
    <button
      type={type}
      onClick={onPress}
      disabled={disabled}
      className="pt-btn pt-btn-primary"
      style={{ backgroundColor: bg }}
    >
      {icon && <Icon name={icon} size={22} color={colors.text} />}
      <span>{title}</span>
    </button>
  );
}

export function OutlineButton({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon?: IconName;
  onPress?: () => void;
}) {
  return (
    <button type="button" onClick={onPress} className="pt-btn pt-btn-outline">
      {icon && <Icon name={icon} size={20} color={colors.textSoft} />}
      <span>{title}</span>
    </button>
  );
}

export function IconButton({
  icon,
  onPress,
  label,
  bg = colors.surface2,
  color = colors.text,
  spin = false,
}: {
  icon: IconName;
  onPress?: () => void;
  label: string;
  bg?: string;
  color?: string;
  spin?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={label}
      title={label}
      className="pt-icon-btn"
      style={{ backgroundColor: bg }}
    >
      <Icon name={icon} size={22} color={color} className={spin ? 'pt-spin' : undefined} />
    </button>
  );
}

export function TextField({
  icon,
  error,
  right,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  icon: IconName;
  error?: boolean;
  right?: ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? colors.red : focused ? colors.blue : colors.border;
  return (
    <div className="pt-field" style={{ borderColor }}>
      <Icon name={icon} size={20} color={focused ? colors.blue : colors.textMuted} />
      <input
        className="pt-field-input"
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
      {right}
    </div>
  );
}

export function Card({
  children,
  className = '',
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`pt-card ${className}`} style={style}>
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <span className="pt-section-label">{children}</span>;
}

export function InfoRow({
  icon,
  label,
  value,
  sub,
}: {
  icon: IconName;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="pt-info-row">
      <div className="pt-info-icon">
        <Icon name={icon} size={20} color={colors.blue} />
      </div>
      <div className="pt-info-body">
        <SectionLabel>{label}</SectionLabel>
        <div className="pt-info-value">{value}</div>
        {sub && <div className="pt-info-sub">{sub}</div>}
      </div>
    </div>
  );
}

export function Avatar({
  size = 44,
  online,
  initials = 'PP',
}: {
  size?: number;
  online?: boolean;
  initials?: string;
}) {
  return (
    <div className="pt-avatar-wrap" style={{ width: size, height: size }}>
      <div
        className="pt-avatar"
        style={{
          width: size,
          height: size,
          fontSize: Math.round(size * 0.4),
        }}
      >
        {initials}
      </div>
      {online && <span className="pt-online-dot" aria-label="Online" />}
    </div>
  );
}

export function ChatBubble({ msg }: { msg: Message }) {
  const mine = msg.from === 'me';
  return (
    <div className={`pt-bubble ${mine ? 'is-mine' : 'is-peter'}`}>
      <p className="pt-bubble-text">{msg.text}</p>
      <div className="pt-bubble-meta">
        <span className="pt-bubble-time">{hhmm(msg.at)}</span>
        {mine && (
          <Icon
            name={msg.read ? 'done-all' : 'done'}
            size={14}
            color="rgba(255,255,255,0.85)"
          />
        )}
      </div>
    </div>
  );
}

export function Banner({ icon, text }: { icon: IconName; text: string }) {
  return (
    <div className="pt-banner" role="alert">
      <Icon name={icon} size={20} color={colors.redSoft} />
      <span className="pt-banner-text">{text}</span>
    </div>
  );
}
