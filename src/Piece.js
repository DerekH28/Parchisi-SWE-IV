class Piece {
    constructor(playerId, startPosition, homePosition){
        this.playerId = playerId;
        this.position = startPosition;
        this.homePosition = homePosition;
        this.isSafe = false;
        this.isAtHome = false;
    }
    //moves the pieces forward based on the dice roll number of steps chosen and a given board
    move(steps, board){
        if (this.isAtHome) return false;
        let newPosition = this.position + steps;
        //not allowed to overshoot home, it can only roll the exact amount needed to reach home or skip turn
        if(newPosition > this.homePosition){
            return false
        }
        this.position = newPosition;
        this.isSafe = board(this.position)?.isDage || false;

        if(this.position === this.homePosition){
            this.isAtHome = true;
        }
        //make blockade functionality
        //call kick rival piece off
        //
        return true

        }
    //checks if the piece can move out of the start position based on the dice rolling a five
    canLeaveStart(diceRoll){
        return this.position === -1 && diceRoll === 5;

    }
    //moves the piece from the start area to the first position based on the colors start position
    leaveStart(firstPosition){
        if(this.position === -1){
            this.position = firstPosition;
        }
    }
    //checks if this peice kicks another piece off of the board by landing on the same spot
    kickRivalPieceOff(otherPiece){
        return this.position === otherPiece.position && this.playerId !== otherPieve.playerId && !this.isSafe;
    }
    //sends a kicked off peice back to the starting area
    sendToStart(){
        this.position = -1;
        this.isAtHome = false;
        this.isSafe = false
    }
}
export default Piece;
