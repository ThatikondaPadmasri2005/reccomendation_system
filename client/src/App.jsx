import { useState } from "react";
import RecommendationCard from "./components/RecommendationCard";
import Roadmap from "./components/Roadmap";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const initialForm = {
  goal: "",
  category: "",
  budget: "",
  interests: "",
  constraints: ""
};

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          interests: form.interests
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        })
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Request failed.");
      setData(payload);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <h1>AI Recommendation System (Gemini + React)</h1>
      <form onSubmit={onSubmit} className="panel">
        <label>
          Goal *
          <input name="goal" value={form.goal} onChange={onChange} required />
        </label>

        <label>
          Category *
          <input
            name="category"
            value={form.category}
            onChange={onChange}
            placeholder="career, books, courses, travel"
            required
          />
        </label>

        <label>
          Budget
          <input
            name="budget"
            value={form.budget}
            onChange={onChange}
            placeholder="$500 / low / premium"
          />
        </label>

        <label>
          Interests (comma separated)
          <input
            name="interests"
            value={form.interests}
            onChange={onChange}
            placeholder="AI, startups, fitness"
          />
        </label>

        <label>
          Constraints
          <textarea
            name="constraints"
            value={form.constraints}
            onChange={onChange}
            placeholder="No weekend schedule, beginner level only..."
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Get Recommendations"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {data && (
        <section className="results">
          <h2>Summary</h2>
          <p>{data.summary}</p>

          <h2>Recommendations</h2>
          <div className="grid">
            {(data.recommendations || []).map((item, idx) => (
              <RecommendationCard key={`${item.title}-${idx}`} item={item} />
            ))}
          </div>

          <Roadmap steps={data.roadmap || []} />
        </section>
      )}
    </main>
  );
}
