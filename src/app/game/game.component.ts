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

  pickCardAnimation = false;
  currentCard: any = '';
  game!: Game;

  ngOnInit(): void {
    if (!this.game) {
      this.newGame()
    }
    this.route.params.subscribe((params) => {
      console.log(params['id']);
      let gameId = params['id'];
      console.log(gameId);
      this.subGame(gameId);
    })
  }

  async addGame() {
    console.log(this.game);
    await addDoc(this.getGamesRef(), this.game).catch(
      (err) => {
        console.error(err);
      }
    ).then(
      (docRef) => { console.log("Document written with ID: ", docRef?.id) }
    )
  }

  subGame(gameId: string) {
    onSnapshot(doc(this.firestore, "games", gameId), (gameSnapshot) => {
      let data = gameSnapshot.data() as Game;
      console.log(data);
      if (data) {
        this.game.currentPlayer = data.currentPlayer;
        this.game.playedCards = data.playedCards;
        this.game.players = data.players;
        this.game.stack = data.stack;
      }
    });
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }

  newGame() {
    this.game = new Game();
    // this.addGame(this.game.toJson());
  }

  takeCard() {
    if (!this.pickCardAnimation && this.game.players.length >= 2) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      setTimeout(() => {
        this.pickCardAnimation = false;
        this.game.playedCards.push(this.currentCard);
      }, 1200);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }
}
