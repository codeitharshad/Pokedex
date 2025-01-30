import { useState, useEffect } from "react";
import CardForModal from "./CardForModal";
import CardForEvolutionChain from "./CardForEvolutionChain";

const Modal = ({ selectedPokemon, closeModal }) => {
  const [pokemonDiscription, setPokemonDiscription] = useState("");
  const [pokemonAllInfo, setPokemonAllInfo] = useState({});
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (!selectedPokemon) return;

    const url_text = `https://pokeapi.co/api/v2/pokemon-species/${selectedPokemon.id}/`;

    fetch(url_text)
      .then((result) => result.json())
      .then((data_text) => {
        const englishInfo = data_text?.flavor_text_entries
          ?.filter((entry) => entry.language?.name === "en")
          .map((entry) => entry.flavor_text.replace(/\n|\f/g, " "))
          .filter((desc, index, self) => self.indexOf(desc) === index);

        const pokemon_description = englishInfo.join(" ");
        setPokemonDiscription(pokemon_description);
        setPokemonAllInfo(data_text);

        fetch(data_text.evolution_chain.url)
          .then((res) => res.json())
          .then((evolutionData) => {
            const chain = [];
            let current = evolutionData.chain;
            // console.log(evolutionData)

            while (current) {
              chain.push({
                name: current.species.name,
                id: current.species.url.split("/").slice(-2, -1)[0],
              });
              current = current.evolves_to[0] || null;
            }

            setEvolutionChain(chain);
          });
      })
      .catch((error) => {
        console.error("Error fetching Pokémon data:", error);
      });
  }, [selectedPokemon]);
  // console.log(evolutionData);

  const hp = selectedPokemon?.stats?.[0]?.base_stat || 0;
  const attack = selectedPokemon?.stats?.[1]?.base_stat || 0;
  const defense = selectedPokemon?.stats?.[2]?.base_stat || 0;
  const spAttack = selectedPokemon?.stats?.[3]?.base_stat || 0;
  const spDefense = selectedPokemon?.stats?.[4]?.base_stat || 0;
  const speed = selectedPokemon?.stats?.[5]?.base_stat || 0;
  const weight = selectedPokemon?.weight || 0;
  const height = selectedPokemon?.height || 0;
  const name = selectedPokemon?.name || "Unknown";
  const id = selectedPokemon?.id?.toString().padStart(3, "0") || "000";

  const weaknesses = ["Fighting", "Ground", "Steel", "Water", "Grass"];
  const color = {
    normal: "#DDCBD0",
    fighting: "#FCC1B0",
    flying: "#B2D2EB",
    poison: "#CFB7ED",
    ground: "#F4D1A6",
    rock: "#C5AEA8",
    bug: "#C1E0C8",
    ghost: "#D7C2D7",
    steel: "#C2D4CE",
    fire: "#EDC2C4",
    water: "#CBD5ED",
    grass: "#C0D4C8",
    electric: "#E2E2A0",
    psychic: "#DDC0CF",
    ice: "#C7D7DF",
    dragon: "#CADCDF",
    dark: "#C6C5E3",
    fairy: "#E4C0CF",
    unknown: "#C0DFDD",
    shadow: "#CACACA",
  };

  function getWidth(value) {
    if (value >= 100) {
      return "100%";
    }
    return value + "%";
  }

  return (
    <div className="modal-bg" onClick={closeModal}>
      <div className="modal-main" onClick={(e) => e.stopPropagation()}>
        <div className="modal-first-section">
          <div className="fist-section-image-div">
            <CardForModal selectedPokemon={selectedPokemon} />
          </div>
          <div className="first-section-info-div">
            <div className="first-section-info-subdiv1">
              <h1 className="modal-title">{name}</h1>
              <div className="modal-separator"></div>
              <h1 className="modal-id">{id}</h1>
              <div className="modal-separator"></div>
              <div className="prev-button modal-buttons">
                <img src="previous-arrow.png" alt="Previous" />
                <img src="cross.png" alt="Close" onClick={closeModal} />
                <img src="next-arrow.png" alt="Next" />
              </div>
            </div>
            <div className="first-section-info-subdiv2">
              <p>
                {showFullDescription
                  ? pokemonDiscription
                  : `${pokemonDiscription.substring(0, 350)}...`}
                <span
                  className="show-more-button"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? " read less" : " read more"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="modal-second-section">
          <div className="height">
            <h5>Height</h5>
            {height && <p>{height}"</p>}
          </div>
          <div className="weight">
            <h5>Weight</h5>
            {weight && <p>{weight} kg</p>}
          </div>
          <div className="genders">
            <h5>Gender(s)</h5>
            <p>Male, Female</p>
          </div>
          <div className="egg">
            <h5>Egg Groups</h5>
            {pokemonAllInfo.egg_groups?.map((data, index) => (
              <p className="egg-group-div-p" key={data.name}>
                {data.name}
                {index !== pokemonAllInfo.egg_groups.length - 1 && ",\u00A0 "}
              </p>
            ))}
          </div>
          <div className="abilities">
            <h5>Abilities</h5>
            {selectedPokemon.abilities?.map((data, index) => (
              <p key={index}>
                {data.ability.name}
                {index !== selectedPokemon.abilities.length - 1 && ",\u00A0 "}
              </p>
            ))}
          </div>
          <div className="types">
            <h5>Types</h5>
            {selectedPokemon?.types.map((ele) => (
              <p
                className="type-text"
                style={{ backgroundColor: color[ele.type.name.toLowerCase()] }}
                key={ele.type.name}
              >
                {ele.type.name}
              </p>
            ))}
          </div>
          <div className="weak-against">
            <h5>Weak Against</h5>
            {weaknesses.map((ele, index) => (
              <p
                className="type-text"
                style={{ backgroundColor: color[ele.toLowerCase()] }}
                key={index}
              >
                {ele}
              </p>
            ))}
          </div>
        </div>

        <div className="modal-third-section">
          <div className="stats-grid">
            <div className="stats-header">Stats</div>

            <div className="stats-cell">
              <span className="stat-type">HP</span>
              <div className="stat-bar">
                <div className="stat-bar-fill" style={{ width: getWidth(hp) }}>
                  {hp}
                </div>
              </div>
            </div>

            <div className="stats-cell">
              <span className="stat-type">Attack</span>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill"
                  style={{ width: getWidth(attack) }}
                >
                  {attack}
                </div>
              </div>
            </div>

            <div className="stats-cell">
              <span className="stat-type">Defense</span>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill"
                  style={{ width: getWidth(defense) }}
                >
                  {defense}
                </div>
              </div>
            </div>
            <div className="stats-cell">
              <span className="stat-type">Speed</span>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill"
                  style={{ width: getWidth(speed) }}
                >
                  {speed}
                </div>
              </div>
            </div>

            <div className="stats-cell">
              <span className="stat-type">Sp. Attack</span>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill"
                  style={{ width: getWidth(spAttack) }}
                >
                  {spAttack}
                </div>
              </div>
            </div>
            <div className="stats-cell">
              <span className="stat-type">Sp. Defence</span>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill"
                  style={{ width: getWidth(spDefense) }}
                >
                  {spDefense}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-forth-section">
          <h2>Evolution Chain</h2>
          <div className="evolution-chain-box">
            {evolutionChain.map((evo) => (
              <CardForEvolutionChain eachPokemon={evo} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
