export default function RecommendationCard({ item }) {
  return (
    <article className="card">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <div className="meta">
        <span>Score: {item.reasonScore}/100</span>
        <span>Next: {item.nextStep}</span>
      </div>
    </article>
  );
}
