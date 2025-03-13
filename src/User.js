import Piece from "./Piece.js"

class User {
    static nextUserId = 1;

    constructor(username, myColor, startPosition, homePosition){
        this.username = username;
        this.userId = User.nextUserId++;
        this.myColor = myColor;
        this.pieces = this.initializePieces(startPosition, homePosition);

    }
    //Initializes the user's four pieces
    intializePieces(startPosition, homePosition){
        return Array.from({lenght: 4}, () => new Piece(this.userId, startPosition, homePosition));
    }

    //checks how many pieces are active (not in start)
    countActivePieces(){
        return this.pieces,filter(piece => piece.position !== -1).length;
    }

    //checks if all pieces of a player have reached home
    hasWon(){
        return this.pieces.every(piece => piece.isAtHome);
    }
}
export default User;