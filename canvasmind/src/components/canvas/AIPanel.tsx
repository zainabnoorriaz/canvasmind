"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles } from "lucide-react";

export interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

interface AIPanelProps {
  thumbnailDataUrl: string;
  selectedLabel: string;
  messages: ChatMessage[];
  loading: boolean;
  onSend: (question: string) => void;
  onClose: () => void;
}

export default function AIPanel({
  thumbnailDataUrl,
  selectedLabel,
  messages,
  loading,
  onSend,
  onClose,
}: AIPanelProps) {
  const [input, setInput] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div style={{ position: "fixed", top: 90, right: 20, zIndex: 25 }}>
      <svg
        width="70"
        height="70"
        viewBox="0 0 160 160"
        style={{ position: "absolute", top: -40, right: -6, zIndex: 2 }}
      >
        <ellipse cx="45" cy="130" rx="16" ry="12" fill="#F0997B" />
        <ellipse cx="115" cy="130" rx="16" ry="12" fill="#F0997B" />
        <path d="M 40 55 Q 30 15 60 42 Z" fill="#F0997B" />
        <path d="M 120 55 Q 130 15 100 42 Z" fill="#F0997B" />
        <path d="M 42 50 Q 36 26 55 40 Z" fill="#FBD9CC" />
        <path d="M 118 50 Q 124 26 105 40 Z" fill="#FBD9CC" />
        <circle cx="80" cy="85" r="58" fill="#F5B48F" />
        <ellipse cx="42" cy="92" rx="10" ry="8" fill="#F7C9AE" opacity="0.7" />
        <ellipse cx="118" cy="92" rx="10" ry="8" fill="#F7C9AE" opacity="0.7" />
        <circle cx="55" cy="82" r="14" fill="#2C2320" />
        <circle cx="105" cy="82" r="14" fill="#2C2320" />
        <circle cx="59" cy="76" r="4.5" fill="#ffffff" />
        <circle cx="109" cy="76" r="4.5" fill="#ffffff" />
        <circle cx="52" cy="88" r="2.5" fill="#ffffff" opacity="0.8" />
        <circle cx="102" cy="88" r="2.5" fill="#ffffff" opacity="0.8" />
        <ellipse cx="80" cy="98" rx="4.5" ry="3.5" fill="#D4537E" />
        <path d="M 72 104 Q 80 110 88 104" stroke="#8A4A2E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="38" cy="102" r="9" fill="#F7A6A1" opacity="0.7" />
        <circle cx="122" cy="102" r="9" fill="#F7A6A1" opacity="0.7" />
        <g stroke="#8A4A2E" strokeWidth="1.2" strokeLinecap="round" opacity="0.5">
          <line x1="20" y1="95" x2="46" y2="98" />
          <line x1="20" y1="104" x2="46" y2="103" />
          <line x1="140" y1="95" x2="114" y2="98" />
          <line x1="140" y1="104" x2="114" y2="103" />
        </g>
      </svg>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: 300,
          background: "#fff",
          border: "2px solid #F4C0D1",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 4px 14px rgba(212,83,126,0.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 14px",
            background: "#FBEAF0",
            borderBottom: "2px solid #F4C0D1",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, color: "#993556", fontSize: 13 }}>
            <Sparkles size={16} color="#D4537E" /> AI Assistant
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#993556" }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: "10px 14px", borderBottom: "1px solid #FBEAF0" }}>
          <div style={{ fontSize: 11, color: "#B96C89", marginBottom: 6 }}>Selected</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFF6FA", border: "1px solid #F4C0D1", borderRadius: 10, padding: 6 }}>
            {thumbnailDataUrl && (
              <img src={thumbnailDataUrl} alt="Selected region" style={{ width: 28, height: 28, borderRadius: 6, objectFit: "cover" }} />
            )}
            <span style={{ fontSize: 12, color: "#7A3A50" }}>{selectedLabel}</span>
          </div>
        </div>

        <div ref={threadRef} style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8, maxHeight: 260, overflowY: "auto" }}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
                background: m.role === "user" ? "#D4537E" : "#FBEAF0",
                color: m.role === "user" ? "#fff" : "#5A2438",
                fontSize: 13,
                padding: "8px 12px",
                borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                whiteSpace: "pre-wrap",
              }}
            >
              {m.text}
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: "flex-start", fontSize: 12, color: "#B96C89" }}>Thinking...</div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: 10, borderTop: "2px solid #FBEAF0" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything about this..."
            style={{ flex: 1, border: "1px solid #F4C0D1", borderRadius: 999, padding: "8px 12px", fontSize: 12, outline: "none", color: "#5A2438" }}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: "#D4537E", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}