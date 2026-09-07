import DocumentPage from "@/components/public/DocumentPage";
export default function Page() {
  return (
    <DocumentPage
      namespace="privacy"
      sections={["information", "usage", "security", "rights", "contact"]}
    />
  );
}
