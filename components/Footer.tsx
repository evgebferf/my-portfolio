import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        Motion Designer &copy; {new Date().getFullYear()}
      </div>
      <div className="footer-links">
        <Link href="https://vimeo.com" target="_blank" rel="noopener noreferrer">Behance</Link>
        <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">Telegram</Link>
        <Link href="mailto:hello@example.com">Email</Link>
      </div>
    </footer>
  );
}
