import { ImageResponse } from "next/og";

export const alt = "Octom – Know who to contact today";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#ffffff",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", fontSize: 130, fontWeight: 700, color: "#111827" }}>
          oc<span style={{ color: "#4F46E5" }}>t</span>om
        </div>
        <div style={{ display: "flex", fontSize: 48, color: "#4b5563", marginTop: 24 }}>
          Know who to contact today.
        </div>
      </div>
    ),
    size
  );
}
