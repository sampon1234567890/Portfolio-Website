export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="section-head">
      <p className="section-kicker">Portfolio Section</p>
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}
