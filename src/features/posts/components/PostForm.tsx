"use client";

import { useMemo, useState } from "react";

type Props = {
  initialTitle?: string;
  initialBody?: string;
  submitText: string;
  isSubmitting?: boolean;
  onSubmit: (input: { title: string; body: string }) => void;
  onCancel?: () => void;
};

export function PostForm({
  initialTitle = "",
  initialBody = "",
  submitText,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);

  const titleTrim = title.trim();
  const bodyTrim = body.trim();

  const validationMessage = useMemo(() => {
    if (!titleTrim) return "제목을 입력해주세요.";
    if (titleTrim.length < 3) return "제목은 3자 이상 입력해주세요.";
    if (!bodyTrim) return "내용을 입력해주세요.";
    if (bodyTrim.length < 10) return "내용은 10자 이상 입력해주세요.";
    return null;
  }, [titleTrim, bodyTrim]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (validationMessage) {
          alert(validationMessage);
          return;
        }
        onSubmit({ title: titleTrim, body: bodyTrim });
      }}
      style={{ display: "grid", gap: 12 }}
    >
      <label style={{ display: "grid", gap: 6 }}>
        <span>제목</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>내용</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
          disabled={isSubmitting}
        />
      </label>

      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" disabled={isSubmitting || !!validationMessage}>
          {isSubmitting ? "처리 중..." : submitText}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={isSubmitting}>
            취소
          </button>
        )}
      </div>

      {validationMessage && <p style={{ margin: 0, color: "#666" }}>{validationMessage}</p>}
    </form>
  );
}