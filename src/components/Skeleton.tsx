"use client";

export function Skeleton({ height = 14, width = "100%" }: { height?: number; width?: number | string }) {
  return (
    <div
      style={{
        height,
        width,
        borderRadius: 8,
        background: "#eee",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: "translateX(-100%)",
          background:
            "linear-gradient(90deg, rgba(238,238,238,0) 0%, rgba(220,220,220,0.7) 50%, rgba(238,238,238,0) 100%)",
          animation: "skeleton 1.2s infinite",
        }}
      />
      <style>{`
        @keyframes skeleton {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
