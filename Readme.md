## Battleship Commander API
This is the supporting API of the Battleship Commander Game.

## Database Schema
![alt text](https://raw.githubusercontent.com/lakylekidd/battleship-commander-api/master/db_schema.png "Database Image")

## Scoring
The api will calculate the total number of movements (T) and the total number of correct targets hit (C). The percentage of those two variables will result in the Accuracy of the player in percentage (A). Scores will be calculated on the fly.

## Win Conditions - Guards
* When one player has destroyed all of the opponent's ships he becomes the winner.
* When the turns reach 100 a guard will end the game and the player with the greatest accuracy will become the winner.

## API Endpoints
These are the available endpoints of the API `@root : http://mywebsite.com`.
* **POST @root/users/login**:  
    Logs in the user and returns an identification token valid for 30 minutes.
* **GET @root/games**:  
    Returns a list of available games the user can log in
* **POST @root/games**:  
    Creates a new game and assigns the requesting user as the game owner.
* **POST @root/games/:id**:  
    Accepts fire acctions from players. These actions convert a tile as targeted.
* **GET @root/games/:id/stream**:  
    The stream of the selected game. Allows players to join an existing game.
* **GET @root/games/:id/join**:  
    Allows a user to join the game. Will create a second board in the game and assign the requesting user as the board owner.
* **POST @root/games/:id/ready/:boardId**:  
    Specifies that the current board is ready to play. Fires an event to the stream notifying all the clients.

## TODOS
This is a list of todos for the current development of this project.
* When user logs in and clicks on join game, he should be able to rejoin any games he abandoned.
