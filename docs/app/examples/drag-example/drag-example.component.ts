import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { OutsidePlacement } from '../../../../projects/toppy/src/lib/models';
import { RelativePosition, Toppy, ToppyControl } from '../../../../projects/toppy/src/public_api';

@Component({
  selector: 'app-drag-example',
  templateUrl: './drag-example.component.html'
})
export class DragExampleComponent implements OnInit {
  pos1 = 0;
  pos2 = 0;
  pos3 = 0;
  pos4 = 0;
  @ViewChild('el') el: ElementRef;
  private _toppyControl: ToppyControl;
  pauser = new Subject();
  constructor(private toppy: Toppy) {}

  ngOnInit() {
    this._toppyControl = this.toppy
      .position(
        new RelativePosition({
          placement: OutsidePlacement.TOP,
          src: this.el.nativeElement,
          width: 'auto',
          autoUpdate: true
        })
      )
      .content('Drag me', { class: 'tooltip' })
      .create();
  }

  ngAfterViewInit() {
    this.dragElement();
  }
  reset() {
    this.el.nativeElement.style.left = '0px';
    this.el.nativeElement.style.top = '0px';
  }
  onMouseOver() {
    this._toppyControl.open();
  }
  onMouseLeave() {
    this._toppyControl.close();
  }
  dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    this.pos3 = e.clientX;
    this.pos4 = e.clientY;
    document.onmouseup = this.closeDragElement.bind(this);
    // call a function whenever the cursor moves:
    document.onmousemove = this.elementDrag.bind(this);
  }

  elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    this.pos1 = this.pos3 - e.clientX;
    this.pos2 = this.pos4 - e.clientY;
    this.pos3 = e.clientX;
    this.pos4 = e.clientY;
    this.el.nativeElement.style.top = this.el.nativeElement.offsetTop - this.pos2 + 'px';
    this.el.nativeElement.style.left = this.el.nativeElement.offsetLeft - this.pos1 + 'px';
  }

  closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }

  dragElement() {
    this.el.nativeElement.onmousedown = this.dragMouseDown.bind(this);
  }
}
