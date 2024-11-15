import { useEffect, useState } from "react";
import styles from "./compo.module.css";

interface QueryModi {
  game_name: string;
  game_type: string;
  onOrOff: string;
}

function CenterNavigator({ game_name, game_type, onOrOff }: QueryModi) {
  const [gameData, setGameData] = useState([]); // it holds basic game info
  const [anodata, setAnoData] = useState([]); // Anonymous it contians the other info for games
  const [disDes, setDisDesc] = useState(false); // Display description...........

  const [gameName, setGameName] = useState(null);
  const [gameImage, setImage] = useState(null);
  const [gameDesc, setDesc] = useState("");
  const [hlink, setHlink] = useState("");
  const [Search_result_found, setSearchResultFound] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      setDisDesc(false);
      try {
        const payload = {
          gameN: game_name,
          gameT: game_type,
          gameI: onOrOff,
        };
        console.log("Payload : ", JSON.stringify(payload));
        const gameResponse = await fetch("http://localhost:8080/api/homepage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        //if (anodata == null) {
        const iconResponse = await fetch("http://localhost:8080/api/icons");
        if (!iconResponse.ok) {
          console.log("failed to fetch icon info");
          throw new Error("Failed to fetch icon data from server");
        } else {
          const iconData = await iconResponse.json();
          setAnoData(iconData);
        }
        //}
        if (!gameResponse.ok) {
          console.log("failed to fetch game data");
          throw new Error("Network response was not ok");
        } else {
          console.log("game data fetched successfully");
        }
        const gameData = await gameResponse.json();
        if (gameData != null) {
          setSearchResultFound("");
          setGameData(gameData);
        } else {
          setSearchResultFound("Result not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [game_name, game_type, onOrOff]); // Run effect once on mount

  if (disDes == false) {
    return (
      <div id={"CentOter"}>
        <h4>{Search_result_found}</h4>
        <div id={styles.centralNavigatorBox}>
          {gameData.map((game) => (
            <div key={game.game_name} id={game.game_name}>
              <button
                id={styles.centralNavigator}
                style={{
                  backgroundImage: `url(data:image/png;base64,${game.image})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
                onClick={() => {
                  setDisDesc(true);
                  setGameName(game.game_name);
                  setImage(game.image);
                  setDesc(game.description);
                  setHlink(game.link);
                }}
              />
              <div
                id={styles.likeNavigator}
                style={{ backgroundColor: "transparent" }}
              >
                {anodata.map((icon) => (
                  <div
                    style={{
                      backgroundColor: "transparent",
                    }}
                    key={icon.image_name}
                    id={"CentOter1"}
                  >
                    <button
                      id={styles.likeNavigatorSub}
                      style={{
                        backgroundColor: "transparent",
                        backgroundImage: `url(data:image/png;base64,${icon.image})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    console.log(hlink);
    return (
      <>
        <div
          style={{
            display: "flex",
            textAlign: "right",
            backgroundColor: "white",
          }}
        >
          <div style={{ width: "50%" }}>
            <h2>{gameName}</h2>
          </div>
          <div style={{ textAlign: "right", width: "50%" }}>
            <button
              id={styles.button}
              onClick={() => {
                setDisDesc(false);
              }}
            >
              BACK
            </button>
          </div>
        </div>
        <div>
          <hr></hr>
          <img
            src={`data:image/png;base64,${gameImage}`}
            alt={gameImage}
            style={{
              maxWidth: "250px",
              height: "250px",
              borderRadius: "100%",
            }} // Style for responsive image
          />
          <br></br>
          <div style={{ textAlign: "right" }}>
            <button
              style={{
                backgroundColor: "green",
                height: "40px",
                width: "100px",
                borderRadius: "10%",
              }}
              onClick={() => {
                console.log(hlink);
              }}
            >
              <a
                href={hlink}
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontSize: "16px",
                }}
              >
                Download
              </a>
            </button>
          </div>
          <div
            style={{ backgroundColor: "white", textAlign: "left" }}
            dangerouslySetInnerHTML={{ __html: gameDesc }}
          />
        </div>
      </>
    );
  }
}

export default CenterNavigator;
