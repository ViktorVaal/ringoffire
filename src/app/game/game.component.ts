import { CommonModule, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from "../player/player.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from "../game-info/game-info.component";
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, orderBy, limit, where, query, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    MatButtonModule,
    MatIconModule,
    GameInfoComponent,
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {

  firestore: Firestore = inject(Firestore);

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
  };

  
  game: Game = new Game;
  gameId!: string;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      console.log(params['id']);
      let gameId = params['id'];
      console.log(gameId);
      this.subGame(gameId);
    })
  }

  subGame(gameId: string) {
      console.log('subGame called with ID:', gameId);
    onSnapshot(doc(this.firestore, "games", gameId), (gameSnapshot) => {
      let data = gameSnapshot.data() as Game;
      if (this.game) {
        this.game.currentPlayer = data.currentPlayer;
        this.game.playedCards = data.playedCards;
        this.game.players = data.players;
        this.game.stack = data.stack;
        this.game.pickCardAnimation = data.pickCardAnimation;
        this.game.currentCard = data.currentCard;
      }
    });
  }

  async saveGame() {
    await updateDoc(doc(collection(this.firestore, 'games'), this.gameId), this.game.toJson())
  }

  takeCard() {
    if (!this.game.pickCardAnimation && this.game.players.length >= 2) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();
      setTimeout(() => {
        this.game.pickCardAnimation = false;
        this.game.playedCards.push(this.game.currentCard);
        this.saveGame();
      }, 1200);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }
}
