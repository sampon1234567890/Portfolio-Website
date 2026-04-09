import ScrollFloat from "./reactbits/ScrollFloat";

export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="section-head">
      <ScrollFloat
        containerClassName="section-title-float"
        textClassName="section-title-float-text"
        animationDuration={0.8}
        ease="back.inOut(1.5)"
        scrollStart="center bottom+=30%"
        scrollEnd="bottom bottom-=25%"
        stagger={0.02}
      >
        {title}
      </ScrollFloat>
      {subtitle ? <p className="section-subtitle-text">{subtitle}</p> : null}
    </div>
  );
}
