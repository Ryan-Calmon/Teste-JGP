import "../styles/StatsCard.css"
export default function StatsCard({ titulo, valor, icone, cor = 'blue' }) {
  return (
    <div className={`stats-card stats-card-${cor}`}>
      <div className="stats-card-icon">{icone}</div>
      <div className="stats-card-content">
        <h3>{titulo}</h3>
        <p className="stats-card-value">{valor}</p>
      </div>
    </div>
  );
}
