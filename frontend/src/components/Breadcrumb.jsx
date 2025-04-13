import { Link } from "react-router-dom";

export default function Breadcrumb({ items }) {
  return (
    <nav className="text-sm text-gray-500 px-4 py-2" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && " / "}
          {item.to ? <Link to={item.to} className="text-green-600 hover:underline">{item.label}</Link> : item.label}
        </span>
      ))}
    </nav>
  );
}
