import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-8xl font-black mb-4" style={{ color: "#e50914" }}>404</p>
      <h1 className="text-white text-2xl font-bold mb-3">Page not found</h1>
      <p className="text-gray-400 text-sm mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded text-sm font-semibold text-white transition-opacity hover:opacity-80"
        style={{ background: "#e50914" }}
      >
        Back to Home
      </Link>
    </div>
  );
}
