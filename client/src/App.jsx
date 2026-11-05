import Card from "./Card.jsx";
import { useState, useEffect } from "react";

function App() {
  const [cards, setCards] = useState([]);
  const [filter, setFilter] = useState("Todas");
  const [search, setSearch] = useState("");
  const [randomCard, setRandomCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    setRandomCard(null);

    const url =
      filter === "Todas"
        ? "http://localhost:3000/api/cartas"
        : `http://localhost:3000/api/cartas?tipo=${filter}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        return res.json();
      })
      .then((data) => setCards(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filter]);

  const visible = cards.filter((card) =>
    card.name.toLowerCase().includes(search.toLowerCase())
  );

  function chooseRandomCard() {
    setRandomCard(null);

    fetch("http://localhost:3000/api/cartas/aleatoria")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        return res.json();
      })
      .then((data) => setRandomCard(data))
      .catch((err) => setError(err.message));
  }

  return (
    <main>
      <p>
        Aparecem: {cards.length} cartas.
        Visíveis: {visible.length} cartas.
      </p>

      {loading && <p>A carregar…</p>}

      {error && <p>Erro: {error}</p>}

      {!loading && !error && (
        <>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar"
          />

          <div>
            <button onClick={() => setFilter("Todas")}>
              Todas
            </button>

            <button onClick={() => setFilter("Criatura")}>
              Só criaturas
            </button>

            <button onClick={() => setFilter("Feitiço")}>
              Só feitiços
            </button>

            <button onClick={() => setFilter("Toze")}>
              Só Tozés
            </button>

            <button onClick={chooseRandomCard}>
              Carta à sorte
            </button>
          </div>

          {randomCard && (
            <div>
              <h2>Carta à sorte</h2>
              <Card {...randomCard} />
            </div>
          )}

          <ul>
            {visible.map((card) => (
              <Card
                key={card.name}
                name={card.name}
                attack={card.attack}
                type={card.type}
              />
            ))}
          </ul>
        </>
      )}
    </main>
  );
}

export default App;
