import Modal from "./Modal";
import Card from "./Card";
import { useState, useEffect } from "react";

const CardSection = () => {

  const [pokemon, setPokemon] = useState([]);
  const [search, setSearch] = useState("");
  const [totalPage, setTotalPage] = useState();
  const [nextUrl, setNextUrl] = useState();
  const [prevUrl, setPrevUrl] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(
    "https://pokeapi.co/api/v2/pokemon?limit=18&offset=0"
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    fetchPokemon();
  }, [url]);

  const fetchPokemon = async () => {
    setLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();

      setNextUrl(data.next);
      setPrevUrl(data.previous);
      setTotalPage(Math.ceil(data.count / 18));

      const detailedPokemonData = data.results.map(async (curPokemon) => {
        const result = await fetch(curPokemon.url);
        const data = await result.json();
        return data;
      });

      const detailedResponses = await Promise.all(detailedPokemonData);
      setPokemon(detailedResponses);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (nextUrl) {
      setUrl(nextUrl);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const PrevPage = () => {
    if (prevUrl) {
      setUrl(prevUrl);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const searchData = pokemon.filter(
    (curPok) =>
      curPok.name.toLowerCase().includes(search.toLowerCase()) ||
      curPok.id.toString().includes(search)
  );

  const handlePokemonClick = (curPokemon) => {
    setSelectedPokemon(curPokemon);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPokemon(null);
  };

  return (
    <>
      {/*************************************** Search Section ***************************************/}
      <div className="search-container">
        <div className="input-div">
          <label htmlFor="search">Search by</label>
          <input
            value={search}
            type="text"
            id="search"
            className="input-field"
            placeholder="Name or Number"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/*************************************** CardSection ***************************************/}
      {loading ? (
        <div className="cardsection-main">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div className="cardsection-main">
          {searchData.map((curPokemon, index) => (
            <div
              key={index}
              onClick={() => handlePokemonClick(curPokemon)}
              className="pokemon-card"
            >
              <Card eachPokemon={curPokemon} />
            </div>
          ))}
        </div>
      )}

      {/*************************************** Pagination ***************************************/}
      <div className="pagination">
        <button className="pagination-button" onClick={PrevPage}>
          Prev
        </button>
        <p className="pagination-text">
          Page {currentPage} of {totalPage}
        </p>
        <button className="pagination-button" onClick={nextPage}>
          Next
        </button>
      </div>

      {/*************************************** Modal ***************************************/}
      {showModal && selectedPokemon && (
        <Modal selectedPokemon={selectedPokemon} closeModal={closeModal} />
      )}
    </>
  );
};

export default CardSection;
