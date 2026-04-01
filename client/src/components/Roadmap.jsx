export default function Roadmap({ steps }) {
  return (
    <section>
      <h2>Roadmap</h2>
      <div className="roadmap">
        {steps.map((step, idx) => (
          <div key={`${step.phase}-${idx}`} className="phase">
            <h3>{step.phase}</h3>
            <p className="timeline">{step.timeline}</p>
            <ul>
              {step.actions.map((action, i) => (
                <li key={i}>{action}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
