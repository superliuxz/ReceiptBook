import { animate, style, transition, trigger } from '@angular/animations';

export function fadeInFadeOut() {
  return trigger('fadeInFadeOut', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('0.2s', style({ opacity: 1 })),
    ]),
    transition(':leave', [animate('0.2s', style({ opacity: 0 }))]),
  ]);
}
