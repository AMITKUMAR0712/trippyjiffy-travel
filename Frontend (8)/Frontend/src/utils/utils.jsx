import React from "react";
import Style from "../Style/utils.module.scss";

export const safeParse = (data) => {
  if (!data) return {};
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch (error) {
    console.error("❌ JSON parse error:", error, data);
    return {};
  }
};

export const renderBlocks = (paragraphs) => {
  if (!paragraphs || !paragraphs.blocks) return null;

  return paragraphs.blocks.map((block, index) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p
            key={index}
            dangerouslySetInnerHTML={{ __html: block.data.text }}
          />
        );

      case "header":
        return React.createElement(`h${block.data.level || 2}`, {
          key: index,
          dangerouslySetInnerHTML: { __html: block.data.text },
        });

      case "list":
        return block.data.style === "ordered" ? (
          <ol key={index}>
            {block.data.items.map((item, i) => (
              <li
                key={i}
                dangerouslySetInnerHTML={{
                  __html: typeof item === "string" ? item : item.content,
                }}
              />
            ))}
          </ol>
        ) : (
          <ul key={index}>
            {block.data.items.map((item, i) => (
              <li
                key={i}
                dangerouslySetInnerHTML={{
                  __html: typeof item === "string" ? item : item.content,
                }}
              />
            ))}
          </ul>
        );

      case "inlineImage":
        return (
          <div key={index} className={Style.inlineImage}>
            <img src={block.data.url} alt={block.data.caption || "image"} />
            {block.data.caption && <p>{block.data.caption}</p>}
          </div>
        );

      case "checklist":
        return (
          <div key={index} style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "10px 0" }}>
            {block.data.items.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span style={{ 
                  color: item.checked ? "#10b981" : "#94a3b8", 
                  marginTop: "3px", 
                  display: "flex", 
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "18px",
                  flexShrink: 0
                }}>
                  {item.checked ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <div style={{ width: "16px", height: "16px", border: "2px solid #cbd5e1", borderRadius: "3px" }}></div>
                  )}
                </span>
                <span style={{ lineHeight: "1.6", color: "#475569" }} dangerouslySetInnerHTML={{ __html: item.text }} />
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  });
};

export const getPlainText = (data, maxLen = 120) => {
  if (!data) return "";
  try {
    // Unwrap double/triple encoded JSON
    let parsed = data;
    for (let i = 0; i < 3; i++) {
      if (typeof parsed === "object" && parsed !== null) break;
      if (typeof parsed === "string") {
        try { parsed = JSON.parse(parsed); } catch { break; }
      }
    }
    if (parsed?.blocks?.length) {
      const text = parsed.blocks
        .map((b) => {
          if (b.type === "paragraph" || b.type === "header") {
            return (b.data?.text || "").replace(/<[^>]*>/g, "");
          }
          if (b.type === "list") {
            return (b.data?.items || [])
              .map((item) =>
                typeof item === "string"
                  ? item.replace(/<[^>]*>/g, "")
                  : (item?.content || "").replace(/<[^>]*>/g, "")
              )
              .join(", ");
          }
          if (b.type === "checklist") {
            return (b.data?.items || [])
              .map((item) => (item?.text || "").replace(/<[^>]*>/g, ""))
              .join(", ");
          }
          return "";
        })
        .filter(Boolean)
        .join(" ");
      return text.length > maxLen ? text.slice(0, maxLen) + "..." : text;
    }
  } catch {
    // not JSON, treat as raw string
  }
  const raw = String(data).replace(/<[^>]*>/g, "").trim();
  return raw.length > maxLen ? raw.slice(0, maxLen) + "..." : raw;
};
