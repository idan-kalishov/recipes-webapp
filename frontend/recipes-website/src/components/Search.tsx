import React from "react";

interface SearchProps {
  searchedRecipe: string;
  setSearchedRecipe: React.Dispatch<React.SetStateAction<string>>;
}

const Search: React.FC<SearchProps> = ({
  searchedRecipe,
  setSearchedRecipe,
}) => {
  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search"></img>
        <input
          type="text"
          placeholder="search for a recipe"
          value={searchedRecipe}
          onChange={(event) => setSearchedRecipe(event.target.value)}
        ></input>
      </div>
    </div>
  );
};

export default Search;
