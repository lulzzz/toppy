import { Injector, StaticProvider, TemplateRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Content, ContentData, ContentProps, ContentType, ToppyEvent } from './models';

export function getContent(data: ContentData, props: ContentProps = {}): Content {
  let type: ContentType = ContentType.COMPONENT;

  if (typeof data === 'string' && props['hasHTML']) type = ContentType.HTML;
  else if (typeof data === 'string') type = ContentType.STRING;
  else if (data instanceof TemplateRef) type = ContentType.TEMPLATE;

  return { data, type, props };
}

export function createId() {
  return Math.random()
    .toString(36)
    .substr(2, 5);
}

export function newInjector(provider: StaticProvider, parent: Injector) {
  return Injector.create({ providers: [provider], parent });
}

/* html dom utils */

export function cssClass(method: 'add' | 'remove', className: string, target: string = 'body') {
  document.querySelector(target).classList.add(className);
}

export function toCss(styleObj) {
  return Object.keys(styleObj)
    .map(x => (typeof styleObj[x] === 'number' ? `${x}:${styleObj[x]}px` : `${x}:${styleObj[x]}`))
    .join(';');
}

/* events */

class BusClass {
  private _e: Subject<ToppyEvent> = new Subject();
  send(from: string, name: string, data: any = null) {
    this._e.next({ from, name, data });
  }
  listen(from, name): Observable<any> {
    return this._e.asObservable().pipe(
      filter(e => e.from === from && e.name === name),
      map(e => e.data)
    );
  }
  stop(): void {
    this._e.complete();
  }
}
export const Bus = new BusClass();
