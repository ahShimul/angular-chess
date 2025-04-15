import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-iframepage',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.scss'],
})
export class IframepageComponent {
  @Input() flipped: boolean = false;
  safeUrl: SafeResourceUrl;
  @ViewChild('iframeRef') iframeRef!: ElementRef<HTMLIFrameElement>;

  constructor(private sanitizer: DomSanitizer) {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      '/iframepage?flipped=false'
    );
  }
  ngAfterViewInit() {}
  ngOnChanges() {
    const param = this.flipped ? 'true' : 'false';
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `/iframepage?flipped=${param}`
    );
  }
}
