"use client";

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div style={{ padding: 16, border: "1px solid #eee", borderRadius: 10 }}>
      <p style={{ margin: 0, color: "#dc2626" }}>{message}</p>
      {onRetry && (
        <button style={{ marginTop: 10 }} onClick={onRetry}>
          다시 시도
        </button>
      )}
    </div>
  );
}
