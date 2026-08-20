export default function CatMascot() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 70,
        left: 24,
        zIndex: 5,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <svg width="90" height="90" viewBox="0 0 160 160" role="img" aria-label="CanvasMind cat mascot" style={{ marginBottom: -10 }}>
        <ellipse cx="45" cy="130" rx="16" ry="12" fill="#F0997B"></ellipse>
        <ellipse cx="115" cy="130" rx="16" ry="12" fill="#F0997B"></ellipse>

        <path d="M 40 55 Q 30 15 60 42 Z" fill="#F0997B"></path>
        <path d="M 120 55 Q 130 15 100 42 Z" fill="#F0997B"></path>
        <path d="M 42 50 Q 36 26 55 40 Z" fill="#FBD9CC"></path>
        <path d="M 118 50 Q 124 26 105 40 Z" fill="#FBD9CC"></path>

        <circle cx="80" cy="85" r="58" fill="#F5B48F"></circle>

        <ellipse cx="42" cy="92" rx="10" ry="8" fill="#F7C9AE" opacity="0.7"></ellipse>
        <ellipse cx="118" cy="92" rx="10" ry="8" fill="#F7C9AE" opacity="0.7"></ellipse>

        <circle cx="55" cy="82" r="14" fill="#2C2320"></circle>
        <circle cx="105" cy="82" r="14" fill="#2C2320"></circle>
        <circle cx="59" cy="76" r="4.5" fill="#ffffff"></circle>
        <circle cx="109" cy="76" r="4.5" fill="#ffffff"></circle>
        <circle cx="52" cy="88" r="2.5" fill="#ffffff" opacity="0.8"></circle>
        <circle cx="102" cy="88" r="2.5" fill="#ffffff" opacity="0.8"></circle>

        <ellipse cx="80" cy="98" rx="4.5" ry="3.5" fill="#D4537E"></ellipse>
        <path d="M 72 104 Q 80 110 88 104" stroke="#8A4A2E" strokeWidth="2.4" fill="none" strokeLinecap="round"></path>

        <circle cx="38" cy="102" r="9" fill="#F7A6A1" opacity="0.7"></circle>
        <circle cx="122" cy="102" r="9" fill="#F7A6A1" opacity="0.7"></circle>

        <g stroke="#8A4A2E" strokeWidth="1.2" strokeLinecap="round" opacity="0.5">
          <line x1="20" y1="95" x2="46" y2="98"></line>
          <line x1="20" y1="104" x2="46" y2="103"></line>
          <line x1="140" y1="95" x2="114" y2="98"></line>
          <line x1="140" y1="104" x2="114" y2="103"></line>
        </g>
      </svg>

      {/* Decorative pedestal underneath the cat */}
      <div
        style={{
          width: 110,
          height: 22,
          background: "#FBEAF0",
          border: "2px solid #F4C0D1",
          borderRadius: 999,
        }}
      />
    </div>
  );
}