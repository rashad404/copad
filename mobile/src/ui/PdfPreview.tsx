import React from "react";
export default function PdfPreview({
  uri,
  onError,
}: {
  uri: string;
  onError: () => void;
}) {
  return (
    <iframe
      title="PDF"
      src={uri}
      onError={onError}
      style={{ width: "100%", flex: 1, minHeight: 360, border: 0 }}
    />
  );
}
