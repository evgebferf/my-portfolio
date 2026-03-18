import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        Motion Designer &copy; {new Date().getFullYear()}
      </div>
      <div className="footer-links">
  <Link href="https://www.behance.net/evgeniynext" target="_blank" rel="noopener noreferrer">Behance</Link>
  <Link href="https://t.me/prilepskiyee" target="_blank" rel="noopener noreferrer">Telegram</Link>
  <Link href="mailto:evgeniynext1337@gmail.com">Email</Link>
</div>
    </footer>
  );
}
