import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { colors } from '../theme/tokens';
import { useChat } from '../store/useChat';
import { usePeter } from '../store/usePeter';
import { useNav } from '../store/useNav';
import { Icon } from '../components/Icons';
import { Avatar, ChatBubble, IconButton } from '../components/ui';
import { DangerSheet } from '../components/DangerSheet';

export function ChatScreen() {
  const { setTab, openCall, chatDangerOpen, closeDanger } = useNav();
  const { messages, typing, send, markRead } = useChat();
  const status = usePeter((s) => s.status);
  const [text, setText] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    markRead();
  }, [messages.length, markRead]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages.length, typing]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;
    send(text.trim());
    setText('');
  };

  const shareLocation = () => {
    const sendFallback = () => {
      send('📍 Minha localização: 40.75800, -73.98550 (Midtown, Manhattan)');
    };

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          send(
            `📍 Minha localização: ${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`,
          );
        },
        sendFallback,
        { timeout: 3000 },
      );
    } else {
      sendFallback();
    }
  };

  const neighborhood = status?.address.split(',').slice(-2, -1)[0]?.trim() ?? 'Forest Hills';

  return (
    <div className="pt-screen pt-chat-screen">
      <header className="pt-chat-header">
        <IconButton icon="arrow-back" label="Voltar" onPress={() => setTab('map')} />
        <Avatar size={40} online={status?.online} />
        <div className="pt-chat-peer">
          <div className="pt-chat-name">Peter</div>
          <div className="pt-chat-sub">
            {typing ? 'digitando…' : `${status?.online ? 'online' : 'offline'} · ${neighborhood}`}
          </div>
        </div>
        <IconButton icon="call" label="Ligar para Peter" bg={colors.red} onPress={openCall} />
      </header>

      <div ref={listRef} className="pt-chat-messages">
        <div className="pt-date-pill">HOJE</div>
        {messages.map((m) => (
          <ChatBubble key={m.id} msg={m} />
        ))}
        {typing && (
          <div className="pt-bubble is-peter pt-typing-bubble" aria-label="Peter digitando">
            <span className="pt-typing-dot" />
            <span className="pt-typing-dot" />
            <span className="pt-typing-dot" />
          </div>
        )}
      </div>

      <div className="pt-call-card">
        <Icon name="phone-in-talk" size={20} color={colors.blue} />
        <span className="pt-call-text">Precisa falar diretamente?</span>
        <button type="button" className="pt-call-btn" onClick={openCall}>
          <Icon name="call" size={16} color={colors.text} />
          <span>Ligar</span>
        </button>
      </div>

      <form className="pt-chat-input-row" onSubmit={submit}>
        <div className="pt-chat-input-box">
          <button
            type="button"
            className="pt-inline-icon-btn"
            onClick={shareLocation}
            aria-label="Compartilhar localização"
            title="Compartilhar minha localização"
          >
            <Icon name="add-location-alt" size={22} color={colors.textMuted} />
          </button>
          <input
            type="text"
            className="pt-chat-input"
            placeholder="Mensagem"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <button type="submit" className="pt-send-btn" aria-label="Enviar">
          <Icon name="send" size={20} color={colors.text} />
        </button>
      </form>

      <DangerSheet visible={chatDangerOpen} onClose={closeDanger} />
    </div>
  );
}
