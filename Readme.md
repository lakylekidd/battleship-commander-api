## Battleship Commander API
This is the supporting API of the Battleship Commander Game.

## Database Schema
![alt text](https://raw.githubusercontent.com/lakylekidd/battleship-commander-api/master/db_schema.png "Database Image")

## Scoring
The api will calculate the total number of movements (T) and the total number of correct targets hit (C). The percentage of those two variables will result in the Accuracy of the player in percentage (A). Scores will be calculated on the fly.

### Win Conditions - Guards
* When one player has destroyed all of the opponent's ships he becomes the winner.
* When the turns reach 100 a guard will end the game and the player with the greatest accuracy will become the winner.
