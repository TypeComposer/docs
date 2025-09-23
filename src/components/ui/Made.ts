import { DivElement, SpanElement, ImageElement } from 'typecomposer';

type BuiltWithTypeComposeProps = {
  className?: string;
};

export class BuiltWithTypeCompose extends DivElement {
  constructor(options: BuiltWithTypeComposeProps = {}) {
    super({
      className: `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white text-gray-800 font-medium text-xs shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 ${options.className || ''}`
    });

    const logoImage = new ImageElement({
      src: '/typecomposer.svg',
      style: { 
        width: '14px', 
        height: '14px' 
      }
    });

    // Create the text span
    const textSpan = new SpanElement({
      innerText: 'Made with TypeComposer'
    });

    this.append(logoImage);
    this.append(textSpan);
  }
}