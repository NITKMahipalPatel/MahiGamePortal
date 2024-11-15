package main

import (
    "encoding/json"
    "net/http"
    // "os"
    // "io/ioutil"
    "github.com/gorilla/mux"
    "github.com/rs/cors"
    "database/sql"
    "encoding/base64"
    _ "github.com/lib/pq"
    "log"
    "fmt"
    "strings"
    "io"

)

type Message struct {
    GameName string `json:"game_name"`
    ImageBase64 string `json:"image"`
    Description string `json:"description"`
    Hlink string `json:"link"`
}

type ReqData struct {
    GameName string `json:"gameN"`
    GameType string `json:"gameT"`
    Index string `json:"gameI"`
}

func CustomQuery(db *sql.DB) {
   // imagePath := "/var/log/game_images/comment.png"
    data := `https://dw.uptodown.net/dwn/kB0PM1Vw3Z-JWAE6OaB8VZPBl-ad7t7t2hjXmlTzcba5GKOiifNew2tG9I_XsmXVYvwbBvD1wZXXdYiAVc4_bDxPZxib1mE_uKuHgLbIIBOBgr2bXPdSTGsaCEk98_8N/VTyZ8FYYEFx0Ro1BBY1gr-Rf2H9qtdC6t3LFS9dDTAdQTXXvPlSRDrYygWBZxdJPGbNN1pq0Wjov0pIVjVGP8M3h8n_-u0Wu2953qDbgmfPuJglU4n-Lm29d75EIZpdM/09aDuYc2zmV5qVJyZCzLK4RDYJJmLds9HZInUdEoktCw_TAQ3HjNnZF8QlKvRguwkXCFoxrK5YQ2K11iv1UFyw==/pubg-mobile-3-4-0.apk`
    // file, err := os.Open(imagePath)
    // if err != nil {
    //     fmt.Println("could not open image file: ", err)
    //     return
    // }
    // defer file.Close()

    // Read the image file into a byte slice
    // imageData, err := ioutil.ReadAll(file)
    // if err != nil {
    //     fmt.Println("could not read image file: ", err)
    //     return
    // }
   
    query := `update gameloader set Link = $1`
    rows, err := db.Query(query, data)
    if err != nil {
        log.Fatal(err)
        fmt.Println("failure")
    }
    defer rows.Close()
}

func connectDB() *sql.DB {
    constStr := "user=postgres password=123 dbname=gameportaldb host=localhost sslmode=disable"
    db, err := sql.Open("postgres", constStr)
    if err != nil {
        log.Fatal(err)
    }
    
    if err := db.Ping(); err != nil {
        log.Fatal(err)
    }
    return db
}

func ChangeDB() {
    db := connectDB()
    defer db.Close()
    CustomQuery(db)
}

func RemoteAPI() {
    r := mux.NewRouter()
    r.HandleFunc("/api/homepage", pushGameInfo).Methods("POST")
    r.HandleFunc("/api/icons", pushIconsInfo).Methods("GET")
    // CORS setup
    handler := cors.Default().Handler(r)
    
    if err := http.ListenAndServe(":8080", handler); err != nil {
        log.Fatal("ListenAndServe: ", err)
    }
}
func main() {
    //ChangeDB()
    RemoteAPI()
}

func pushIconsInfo(w http.ResponseWriter, r *http.Request) {
    db := connectDB()
    defer db.Close() // Close the connection after the request is handled

    message := fetchfield(db, "anonymousimages","","","")
    if message == nil {
        http.Error(w, "Could not fetch data", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(message)
}

func pushGameInfo(w http.ResponseWriter, r *http.Request) {
    db := connectDB()
    defer db.Close() // Close the connection after the request is handled

    body, err := io.ReadAll(r.Body)
    if err != nil {
        http.Error(w, "Failed to read request body", http.StatusInternalServerError)
        return
    }

    var inputData ReqData
    err = json.Unmarshal(body, &inputData)
    if err != nil {
        fmt.Println("Request decoding error:", err)
        http.Error(w, "Request decoding error", http.StatusBadRequest)
        return
    }

    message := fetchfield(db, "gameloader",inputData.GameName, inputData.GameType, inputData.Index)
    if message == nil {
        http.Error(w, "Could not fetch data", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(message)
}

func fetchfield(db *sql.DB, tb_name string, game_name string, game_type string, ind string) *[]Message {
    query := "SELECT * FROM " + tb_name
    Suff := "%" 
    if tb_name == "anonymousimages" {
        query = query + " where image_name LIKE $1 order by image_name desc"
    } else {
        if(len(game_name) > 0) {
            query = query + " where LOWER(game_name) LIKE $1"
            if(game_name == "xxx") {
                game_name=""
            } else {
                Suff = "%"+strings.ToLower(game_name)+"%"
            }
        }
    }

    rows, err := db.Query(query, Suff)
    if err != nil {
        log.Println("Query Error:", err)
        return nil
    }
    defer rows.Close()

    var gameInfo []Message
    for rows.Next() {
        var tableName, desc, link string
        var imageData []byte
        if err := rows.Scan(&tableName, &imageData, &desc, &link); err != nil {
            log.Println("Scan Error:", err)
            continue // Skip this row and continue
        }
        gameInfo = append(gameInfo, Message{tableName, base64.StdEncoding.EncodeToString(imageData), desc, link})
    }

    if err := rows.Err(); err != nil {
        log.Println("Row Error:", err)
    }

    return &gameInfo
}
