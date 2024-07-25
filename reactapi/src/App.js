import React, { Component } from "react";
import "./App.css";
import Button from "@mui/material/Button";
import SearchComponent from "./SearchComponent"; 

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoaded: false,
      searchQuery: "",
      selectedCharacters: [],
      showComparison: false,
    };
  }

  componentDidMount() {
    fetch("http://homologacao3.azapfy.com.br/api/ps/metahumans")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          isLoaded: true,
          items: json,
        });
      });
  }

  handleSearch = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  handleAddCharacter = (character) => {
    this.setState((prevState) => {
      const newSelection = [...prevState.selectedCharacters, character];
      return {
        selectedCharacters: newSelection.slice(-2), 
        showComparison: newSelection.length >= 2,
      };
    });
  };

  closeComparison = () => {
    this.setState({ showComparison: false, selectedCharacters: [] });
  };

  compareCharacters = () => {
    const [char1, char2] = this.state.selectedCharacters;
    const stats = ["intelligence", "strength", "speed", "durability", "power", "combat"];
    let winner = char1;
    let char1Wins = 0;
    let char2Wins = 0;

    stats.forEach((stat) => {
      if (char1.powerstats[stat] > char2.powerstats[stat]) {
        char1Wins++;
      } else if (char1.powerstats[stat] < char2.powerstats[stat]) {
        char2Wins++;
      }
    });

    if (char2Wins > char1Wins) {
      winner = char2;
    }

    return { char1, char2, winner };
  };

  render() {
    const { isLoaded, items, searchQuery, selectedCharacters, showComparison } = this.state;
    const filteredItems = items.filter((item) =>
      item.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

    if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="Global">
          <form className="search">
            <SearchComponent onSearch={this.handleSearch} /> 
          </form>
          <div className="App">
            {filteredItems.map((item) => (
              <div className="listazinha" key={item.id}>
                <img src={item.images.sm} alt={item.name} />
                <p>{item.name}</p>
                <Button
                  type="button"
                  variant="contained"
                  size="large"
                  sx={{ marginBottom: 2 }}
                  onClick={() => this.handleAddCharacter(item)}
                >
                  Add
                </Button>
              </div>
            ))}
          </div>
          {showComparison && (
            <div className="comparison-overlay">
              <div className="comparison">
                <button className="close-btn" onClick={this.closeComparison}>FECHAR</button>
                {selectedCharacters.length === 2 && (
                  <>
                    <div className="character">
                      <img src={selectedCharacters[0].images.sm} alt={selectedCharacters[0].name} />
                      <p>{selectedCharacters[0].name}</p>
                      <ul>
                        {Object.entries(selectedCharacters[0].powerstats).map(([stat, value]) => (
                          <li key={stat} style={{ color: value > selectedCharacters[1].powerstats[stat] ? "green" : "red" }}>
                            {stat}: {value}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="winner">
                      <img src={this.compareCharacters().winner.images.sm} alt="Winner" />
                      <p>WINNER</p>
                    </div>
                    <div className="character">
                      <img src={selectedCharacters[1].images.sm} alt={selectedCharacters[1].name} />
                      <p>{selectedCharacters[1].name}</p>
                      <ul>
                        {Object.entries(selectedCharacters[1].powerstats).map(([stat, value]) => (
                          <li key={stat} style={{ color: value > selectedCharacters[0].powerstats[stat] ? "green" : "red" }}>
                            {stat}: {value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }
  }
}

export default App;