import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { NgxChessBoardComponent } from 'ngx-chess-board';

enum Player {
  WHITE = 0,
  BLACK = 1,
}

enum MessageType {
  CHESS_MOVE = 'CHESS_MOVE',
  TOGGLE_TURN = 'TOGGLE_TURN',
}

interface GameState {
  fen: string;
  turn: Player;
}

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.scss'],
})
export class ChessComponent implements AfterViewInit {
  @ViewChild('board') board!: NgxChessBoardComponent;

  playerNumber: Player = Player.WHITE;
  currentTurn: Player = Player.WHITE;
  currentPlayer: string = 'Player 1 (White)';

  ngAfterViewInit() {
    window.addEventListener('message', this.receiveMessage.bind(this));

    const urlParams = new URLSearchParams(window.location.search);
    const flipped = urlParams.get('flipped') === 'true';
    this.playerNumber = flipped ? Player.BLACK : Player.WHITE;

    if (flipped) {
      this.board.reverse();
    }

    this.loadGameState();
    this.setSideDisable();
  }

  loadGameState(): void {
    const savedState = localStorage.getItem('chessGameState');
    if (savedState) {
      try {
        const state: GameState = JSON.parse(savedState);
        this.board.setFEN(state.fen);
        this.currentTurn = state.turn;
        this.currentPlayer =
          state.turn === Player.WHITE ? 'Player 1 (White)' : 'Player 2 (Black)';

        if (this.playerNumber === Player.BLACK) {
          this.board.reverse();
        }

        this.setSideDisable();
      } catch (e) {
        console.error('Failed to parse saved game state:', e);
        localStorage.removeItem('chessGameState');
      }
    }
  }

  saveGameState(): void {
    const gameState: GameState = {
      fen: this.board.getFEN(),
      turn: this.currentTurn,
    };
    localStorage.setItem('chessGameState', JSON.stringify(gameState));
  }

  onMove(event: {
    move?: string;
    fen: string;
    pgn?: { pgn: string };
    checkmate: boolean;
  }): void {
    if (this.playerNumber !== this.currentTurn) return;

    if (event.checkmate) {
      localStorage.removeItem('chessGameState');
      const winner =
        this.currentTurn === Player.WHITE
          ? 'Player 1 (White)'
          : 'Player 2 (Black)';
      alert(`${winner} wins!`);
    }

    const message = {
      type: MessageType.CHESS_MOVE,
      move: event.move,
      fen: event.fen,
      pgn: event.pgn?.pgn,
      checkmate: event.checkmate,
    };

    window.parent.postMessage(message, '*');

    this.currentTurn =
      this.currentTurn === Player.WHITE ? Player.BLACK : Player.WHITE;
    this.currentPlayer =
      this.currentTurn === Player.WHITE
        ? 'Player 1 (White)'
        : 'Player 2 (Black)';

    window.parent.postMessage(
      { type: MessageType.TOGGLE_TURN, turn: this.currentTurn },
      '*'
    );

    this.setSideDisable();
    if (!event.checkmate) this.saveGameState();
  }

  receiveMessage(event: MessageEvent): void {
    const data = event.data;
    if (!data) return;

    if (data.type === MessageType.CHESS_MOVE && data.move) {
      this.board.move(data.move);
    }

    if (data.type === MessageType.TOGGLE_TURN) {
      this.currentTurn = data.turn;
      this.currentPlayer =
        this.currentTurn === Player.WHITE
          ? 'Player 1 (White)'
          : 'Player 2 (Black)';
      this.setSideDisable();
    }
  }

  setSideDisable(): void {
    if (this.playerNumber === Player.WHITE) {
      this.board.lightDisabled = this.currentTurn !== Player.WHITE;
      this.board.darkDisabled = true;
    } else {
      this.board.darkDisabled = this.currentTurn !== Player.BLACK;
      this.board.lightDisabled = true;
    }
  }
}
