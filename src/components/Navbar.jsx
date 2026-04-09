const LINKS = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Skills", "#skills"],
  ["Experience", "#experience"],
  ["Projects", "#projects"],
  ["Contact", "#contact"]
];

export default function Navbar() {
  return (
    <header className="site-header">
      <nav className="nav-wrap">
        <div className="nav-spacer" aria-hidden="true" />

        <ul className="nav-links">
          {LINKS.map(([label, href]) => (
            <li key={label}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
