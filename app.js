const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const dbpath = path.join(__dirname, 'cricketTeam.db')
const app = express()
app.use(express.json())

let db = null

const intializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server is running')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message};`)
  }
}
intializeDBAndServer()

//API 1

app.get('/players/', async (request, response) => {
  const list = `SELECT * FROM cricket_team;`
  const players = await db.all(list)
  response.send(players)
})

//API 2

app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {player_name, jersey_number, role} = playerDetails

  const addPlayerQuery = `INSERT INTO cricket_team(player_name,jersey_number,role)
  VALUES(
    "${player_name}",
    "${jersey_number}",
    "${role}")`
  const dbResponse = await db.run(addPlayerQuery)
  const playerId = dbResponse.lastID
  response.send('Player Added to Team')
})

//API 3

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = `SELECT * FROM cricket_team
  WHERE player_id=${playerId}`
  const details = await db.get(playerDetails)
  response.send(details)
})

//API 4

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body

  const {player_name, jersey_number, role} = playerDetails
  const updatePlayersQuery = `UPDATE cricket_team SET 
  player_name="${player_name}",
  jersey_number="${jersey_number}",
  role="${role}"
  WHERE player_id=${playerId};`
  await db.run(updatePlayersQuery)
  response.send('Player Details Updated')
})

//API 5

app.delete('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const deleteQuery = `DELETE FROM cricket_team
  WHERE player_id=${playerId};`
  await db.run(deleteQuery)
  response.send('Player Removed')
})

module.exports = app
