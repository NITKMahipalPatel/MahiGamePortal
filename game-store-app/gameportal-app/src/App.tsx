import { useState } from "react";
import Label from "./Component/compo";
import CenterNavigator from "./Component/CenterNavigator";
import styles from "./App.module.css";
import { FaSearch } from "react-icons/fa";

const WelecomeLable = "Welcome to Mahi Gameportal";

const Cent_nav = (
  <div id={styles.CenterNavigator}>
    <CenterNavigator game_name="xxx" game_type="xxx" onOrOff="xxx" />
  </div>
);

const Cent_search_nav = (
  <div>
    <h1>Search data</h1>
  </div>
);

function App() {
  const [HomeBack, changeHomeBack] = useState(false);

  const [isHoverd, setHovered] = useState(false);
  const [game_type, setGameType] = useState("");
  const [offOrOnline, setOffOrOnline] = useState("");
  const [game_name, setGameName] = useState("");
  const [search_text, setSearchText] = useState("");
  const buttonHoverStyles = {
    transform: "scale(1.5)", // Slightly enlarge the button on hover
    color: "green",
  };

  const OnlineGames_t = (
    <ul style={{ listStyleType: "disc" }}>
      <li>
        <button
          id={styles.button}
          style={{
            borderRadius: "100%",
            padding: "1% 5%",
            width: "160px",
          }}
          onClick={() => {
            setGameType("shooting");
            setOffOrOnline("Online");
          }}
        >
          Shooting games
        </button>
      </li>
      <li>
        <button
          id={styles.button}
          style={{ borderRadius: "100%", padding: "1% 5%", width: "160px" }}
          onClick={() => {
            setGameType("adventure");
            setOffOrOnline("Online");
          }}
        >
          Adventure games
        </button>
      </li>
      <li>
        <button
          id={styles.button}
          style={{ borderRadius: "100%", padding: "1% 5%", width: "160px" }}
          onClick={() => {
            setGameType("racing");
            setOffOrOnline("Online");
          }}
        >
          Racing games
        </button>
      </li>
    </ul>
  );

  const OfflineGames_t = (
    <ul style={{ listStyleType: "disc" }}>
      <li>
        <button
          id={styles.button}
          style={{
            borderRadius: "100%",
            padding: "1% 5%",
            width: "160px",
          }}
          onClick={() => {
            setGameType("shooting");
            setOffOrOnline("Offline");
          }}
        >
          Shooting games
        </button>
      </li>
      <li>
        <button
          id={styles.button}
          style={{ borderRadius: "100%", padding: "1% 5%", width: "160px" }}
          onClick={() => {
            setGameType("adventure");
            setOffOrOnline("Offline");
          }}
        >
          Adventure games
        </button>
      </li>
      <li>
        <button
          id={styles.button}
          style={{ borderRadius: "100%", padding: "1% 5%", width: "160px" }}
          onClick={() => {
            setGameType("racing");
            setOffOrOnline("Offline");
          }}
        >
          Racing games
        </button>
      </li>
    </ul>
  );

  var centNav = (
    <CenterNavigator
      game_name={game_name.length == 0 ? "xxx" : game_name}
      game_type={game_type.length == 0 ? "xxx" : game_type}
      onOrOff={offOrOnline.length == 0 ? "xxx" : offOrOnline}
    />
  );
  const handleText = (event) => {
    setSearchText(event.target.value);
  };

  const pullSearch = () => {
    if (search_text.length > 0) {
      setGameName(search_text);
    } else {
      setGameName("");
    }
  };
  return (
    <div
      id={styles.HomePage}
      style={{ backgroundColor: HomeBack ? "black" : "white" }}
    >
      <div id={styles.Welcome}>
        <Label name={WelecomeLable} />
        <div id={styles.togglePos}>
          <label className={styles.switch}>
            <input
              type="checkbox"
              onClick={() => {
                console.log(HomeBack);
                HomeBack ? changeHomeBack(false) : changeHomeBack(true);
              }}
            />
            <span className={`${styles.slider} ${styles.round}`}></span>
          </label>
        </div>
      </div>

      <div id={styles.MainNavigator}>
        {/*Left naviagator*/}
        <div id={styles.LeftNavigator} style={{ width: "400px" }}>
          <br />
          <br />
          <br />
          <br />
          <div style={{ color: "white" }}>
            <h2>Online games</h2>
            {OnlineGames_t}
            <h2>Offline games</h2>
            {OfflineGames_t}
          </div>
        </div>
        {/*center navigator*/}
        <div>
          <div
            style={{
              textAlign: "right",
              padding: "0% 50%",
            }}
          >
            <>
              <div style={{ display: "flex" }}>
                <input
                  type="text"
                  onChange={handleText}
                  placeholder="Search......"
                  style={{
                    padding: "8px",
                    width: "400px",
                    marginRight: "10px",
                    fontFamily: "san-serif",
                    borderRadius: "10px",
                    background: "none",
                    color: "green",
                    fontSize: "20px",
                  }}
                />
                <button
                  style={{
                    padding: "8px 12px",
                    borderRadius: "4px",
                    background: "none",
                    border: "none",
                    color: "blue",
                    cursor: "pointer",
                    ...(isHoverd ? buttonHoverStyles : {}),
                  }}
                  onClick={pullSearch}
                  onMouseEnter={() => {
                    setHovered(true);
                  }}
                  onMouseLeave={() => {
                    setHovered(false);
                  }}
                >
                  <FaSearch size={20} /> {/* FontAwesome Search Icon */}
                </button>
              </div>
            </>
          </div>
          <div id={styles.CenterNavigator}>{centNav}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
