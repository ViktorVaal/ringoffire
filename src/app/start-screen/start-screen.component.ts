import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, orderBy, limit, where, query, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Game } from '../../models/game';


@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {

  firestore: Firestore = inject(Firestore);


  constructor(private router: Router) { }

  async newGame() {
    let game = new Game();
    let gameData = game.toJson();
    try {
      const docRef = await this.addGame(gameData);
      this.router.navigateByUrl('/game/' + docRef.id);
      console.log(game);
      
    } catch (error) {
      console.error('Failed to create game:', error);
    }
  }

  async addGame(game: {}) {
    try {
      const docRef = await addDoc(this.getGamesRef(), game);
      return docRef;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }
}
