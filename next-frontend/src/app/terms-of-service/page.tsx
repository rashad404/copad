import DocumentPage from "@/components/public/DocumentPage";
export default function Page() {
  return (
    <DocumentPage
      namespace="terms"
      sections={[
        "acceptance",
        "services",
        "userResponsibilities",
        "limitations",
        "intellectualProperty",
        "liability",
        "changes",
        "contact",
      ]}
    />
  );
}
