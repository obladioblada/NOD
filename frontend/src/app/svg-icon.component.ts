import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'nod-svg-icon',
  styleUrls: ['./svg-icon.component.scss'],
  template: `
    <svg>
      <use attr.xlink:href="/assets/icons/symbol-defs.svg#{{icon}}"></use>
    </svg>    `
})
export class SvgIconComponent {
  @Input() icon: string;
}
