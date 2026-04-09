import ScrambledText from "./reactbits/ScrambledText";

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
        <a href="#home" className="brand">
          <ScrambledText className="nav-scrambled-text" radius={80} duration={0.8} speed={0.6} scrambleChars=".:*">
            Portfolio
          </ScrambledText>
        </a>

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
