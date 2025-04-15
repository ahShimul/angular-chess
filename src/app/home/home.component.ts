import {
  Component,
  AfterViewInit,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { IframepageComponent } from '../iframe/iframe.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class MainpageComponent implements AfterViewInit {
  @ViewChildren(IframepageComponent)
  iframeComponents!: QueryList<IframepageComponent>;
  currentTurn: number = 0;

  ngAfterViewInit() {
    window.addEventListener('message', this.handleMessage.bind(this), false);
  }

  handleMessage(event: MessageEvent) {
    if (!event.data) return;

    if (event.data.checkmate) {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
    if (event.data?.type === 'CHESS_MOVE') {
      this.forwardMove(event.data);
      this.toggleTurns();
    }
  }

  forwardMove(message: any) {
    this.iframeComponents.forEach((iframeComponent) => {
      iframeComponent.iframeRef.nativeElement.contentWindow?.postMessage(
        message,
        '*'
      );
    });
  }

  toggleTurns() {
    this.currentTurn = (this.currentTurn + 1) % 2;
    this.iframeComponents.forEach((iframeComponent) => {
      const iframe = iframeComponent.iframeRef.nativeElement;

      iframe.contentWindow?.postMessage(
        {
          type: 'TOGGLE_TURN',
          turn: this.currentTurn,
        },
        '*'
      );
    });
  }
}
