import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-x grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <p className="font-display text-8xl text-leaf">404</p>
        <h1 className="font-display mt-2 text-4xl text-forest">This page has wandered off</h1>
        <p className="mt-3 text-muted">Let&apos;s get you back to something fresh.</p>
        <Link href="/shop" className="btn btn-primary mt-6">Shop products</Link>
      </div>
    </div>
  );
}
