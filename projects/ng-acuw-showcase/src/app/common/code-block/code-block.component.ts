import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { highlightElement } from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';

@Component({
  selector: 'app-code-block',
  template: `<pre><code #codeEl class="language-{{ language }}"><ng-content></ng-content></code></pre>`,
  styles: [``]
})
export class CodeBlockComponent implements AfterViewInit {

  @Input() language = '';

  @ViewChild('codeEl') codeEl: ElementRef | undefined;

  constructor() { }

  ngAfterViewInit(): void {
    if(this.codeEl){
      highlightElement(this.codeEl.nativeElement);
    }
  }
}
