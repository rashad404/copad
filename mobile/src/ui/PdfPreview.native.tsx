import React from "react";
import Pdf from "react-native-pdf";
export default function PdfPreview({
  uri,
  onError,
}: {
  uri: string;
  onError: () => void;
}) {
  return (
    <Pdf
      source={{ uri, cache: false }}
      trustAllCerts={false}
      style={{ flex: 1, minHeight: 360 }}
      onError={onError}
      enableAnnotationRendering
      enablePaging={false}
    />
  );
}
