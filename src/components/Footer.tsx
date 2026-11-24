import { links } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-line" />
        <div className="footer-grid mono">
          <div>
            <span className="logo-solid footer-logo" aria-hidden />
            <p className="dim">RASTRAK // ALL RIGHTS RESERVED © 2026</p>
          </div>
          <nav aria-label="Redes">
            <a href={links.instagram} target="_blank" rel="noreferrer">INSTAGRAM (@_rastrak.music)</a>
            <a href={links.soundcloud} target="_blank" rel="noreferrer">SOUNDCLOUD</a>
            <a href={links.youtube} target="_blank" rel="noreferrer">YOUTUBE</a>
          </nav>
          <p className="dim footer-credit">DESIGN & EXPERIÊNCIA DIGITAL BY SEEKE STUDIO</p>
        </div>
      </div>
    </footer>
  );
}
