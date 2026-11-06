import Image from 'next/image';

/** Local images are optimised by next/image; admin-supplied external URLs are served as-is. */
export default function ProductImage({ src, alt, sizes, priority, className }: { src: string; alt: string; sizes: string; priority?: boolean; className?: string }) {
  const external = /^https?:\/\//.test(src);
  return (
    <Image src={src} alt={alt} fill sizes={sizes} priority={priority} unoptimized={external} className={`object-cover ${className ?? ''}`} />
  );
}
