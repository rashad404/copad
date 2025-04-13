import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-[60vh] flex flex-col justify-center items-center text-center p-6">
        <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-6">Oops! The page you’re looking for doesn’t exist.</p>
        <Link to="/" className="text-green-600 font-medium hover:underline">← Back to Home</Link>
      </div>
    </>
  );
}
