export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <strong>ShopEasy</strong>
          <p className="muted">Aap ki pasand ka online store.</p>
        </div>
        <div className="footer-links">
          <a href="#!" className="link">About</a>
          <a href="#!" className="link">Contact</a>
          <a href="#!" className="link">Privacy</a>
        </div>
        <p className="muted">© {new Date().getFullYear()} ShopEasy. Demo project.</p>
      </div>
    </footer>
  )
}
