const Card = ({ eachPokemon }) => {
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

  const types = eachPokemon.types.map((type) => type?.type?.name) || [];
  const bgColor1 = color[types[0]] || "#FFFFFF";
  const bgColor2 = color[types[1]] || bgColor1;

  const pokemonImage = eachPokemon.sprites?.other?.dream_world?.front_default;
  const name = eachPokemon.name;
  const id = eachPokemon.id.toString().padStart(3, "0");

  return (
    <div
      className="card"
      style={{
        background: `linear-gradient(to bottom, ${bgColor1}, ${bgColor2})`
      }}
    >
      <div className="image-container">
        <img
          className="card-image"
          src={pokemonImage || "/pokemon-icon.png"}
          alt={`Image of ${name}`}
        />
      </div>

      
      <h3 className="card-name">{name}</h3>
      <h3 className="card-number">{id}</h3>
    </div>
  );
};

export default Card;
