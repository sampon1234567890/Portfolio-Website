import { useLayoutEffect, useState } from "react";
import { gsap } from "gsap";

import Navbar from "./components/Navbar";
import SectionTitle from "./components/SectionTitle";
import FadeContent from "./components/reactbits/FadeContent";
import Footer from "./components/Footer";
import { portfolioData } from "./data/portfolioData";

export default function App() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useLayoutEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      ".hero-intro",
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }
    ).fromTo(
      ".hero-card",
      { autoAlpha: 0, x: 30 },
      { autoAlpha: 1, x: 0, duration: 0.8, ease: "power3.out" },
      "-=0.4"
    );

    return () => tl.kill();
  }, []);

  const onFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onContactSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Portfolio Inquiry from ${form.name || "Visitor"}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:${portfolioData.contact.email}?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <Navbar />

      <main>
        <section className="hero" id="home">
          <div className="hero-grid container">
            <div className="hero-intro">
              <p className="eyebrow">Professional Portfolio</p>
              <h1>{portfolioData.name}</h1>
              <p className="hero-title">{portfolioData.title}</p>
              <p className="hero-summary">{portfolioData.summary}</p>
              <div className="hero-actions">
                <a className="btn primary" href="#contact">
                  Let&apos;s Connect
                </a>
                <a className="btn secondary" href={portfolioData.resumeFile} download>
                  Download Resume
                </a>
              </div>
            </div>

            <aside className="hero-card" aria-label="Professional profile photo">
              <img src={portfolioData.photo} alt="Sebastian Ampon" />
            </aside>
          </div>
        </section>

        <section className="section container" id="about">
          <FadeContent blur>
            <SectionTitle
              title="About Me"
              subtitle="A complete view of my professional story, values, and direction."
            />
          </FadeContent>

          <div className="cards two-col">
            <FadeContent className="card">
              <h3>Background</h3>
              <p>{portfolioData.about.background}</p>
            </FadeContent>

            <FadeContent className="card" delay={0.05}>
              <h3>Educational Background</h3>
              <ul>
                {portfolioData.about.education.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </FadeContent>

            <FadeContent className="card">
              <h3>Mission & Vision</h3>
              <p>{portfolioData.about.missionVision}</p>
            </FadeContent>

            <FadeContent className="card" delay={0.05}>
              <h3>Goals & Motivation</h3>
              <p>{portfolioData.about.goalsMotivation}</p>
            </FadeContent>
          </div>

          <FadeContent className="card achievements">
            <h3>Key Achievements</h3>
            <ul>
              {portfolioData.about.achievements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </FadeContent>
        </section>

        <section className="section container" id="skills">
          <FadeContent>
            <SectionTitle
              title="Core Skills & Services"
              subtitle="Technical capabilities and specialized services I offer."
            />
          </FadeContent>

          <div className="cards three-col">
            {portfolioData.skills.map((group, index) => (
              <FadeContent key={group.category} className="card" delay={index * 0.05}>
                <h3>{group.category}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </FadeContent>
            ))}
          </div>

          <FadeContent className="service-strip">
            {portfolioData.services.map((service) => (
              <span key={service}>{service}</span>
            ))}
          </FadeContent>
        </section>

        <section className="section container" id="experience">
          <FadeContent>
            <SectionTitle
              title="Work Experience"
              subtitle="Leadership, operations, and technical delivery experience."
            />
          </FadeContent>

          <div className="stack">
            {portfolioData.experience.map((item, index) => (
              <FadeContent className="card" key={item.role} delay={index * 0.04}>
                <div className="row-head">
                  <h3>{item.role}</h3>
                  <p>{item.period}</p>
                </div>
                <p className="muted">{item.org}</p>
                <ul>
                  {item.responsibilities.map((responsibility) => (
                    <li key={responsibility}>{responsibility}</li>
                  ))}
                </ul>
              </FadeContent>
            ))}
          </div>
        </section>

        <section className="section container" id="projects">
          <FadeContent>
            <SectionTitle
              title="Projects"
              subtitle="Selected systems and product concepts from my academic and practical experience."
            />
          </FadeContent>

          <div className="cards two-col">
            {portfolioData.projects.map((project, index) => (
              <FadeContent key={project.name} className="card" delay={index * 0.03}>
                <h3>{project.name}</h3>
                <p className="muted">{project.role}</p>
                <p>{project.description}</p>
                {project.tech ? <p className="tech">Tech: {project.tech}</p> : null}
              </FadeContent>
            ))}
          </div>
        </section>

        <section className="section container" id="contact">
          <FadeContent>
            <SectionTitle
              title="Contact"
              subtitle="Reach me directly through email, LinkedIn, or the quick message form below."
            />
          </FadeContent>

          <div className="cards two-col">
            <FadeContent className="card">
              <h3>Direct Links</h3>
              <p>
                Email: <a href={`mailto:${portfolioData.contact.email}`}>{portfolioData.contact.email}</a>
              </p>
              <p>
                LinkedIn: <a href={portfolioData.contact.linkedin}>{portfolioData.contact.linkedin}</a>
              </p>
              <p>
                GitHub: <a href={portfolioData.contact.github}>{portfolioData.contact.github}</a>
              </p>
              <a className="btn primary" href={portfolioData.resumeFile} download>
                Download PDF Resume
              </a>
            </FadeContent>

            <FadeContent className="card" delay={0.06}>
              <h3>Quick Message</h3>
              <form onSubmit={onContactSubmit} className="contact-form">
                <label>
                  Name
                  <input
                    required
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={onFormChange}
                    placeholder="Your name"
                  />
                </label>
                <label>
                  Email
                  <input
                    required
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onFormChange}
                    placeholder="you@email.com"
                  />
                </label>
                <label>
                  Message
                  <textarea
                    required
                    name="message"
                    value={form.message}
                    onChange={onFormChange}
                    rows={5}
                    placeholder="Tell me about your project"
                  />
                </label>
                <button className="btn primary" type="submit">
                  Send Message
                </button>
              </form>
            </FadeContent>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
