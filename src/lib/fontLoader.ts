// fontLoader.ts
// Utility to wait for custom font to be loaded using FontFaceObserver
import FontFaceObserver from 'fontfaceobserver';

export function waitForFont(fontFamily: string, timeout = 5000): Promise<void> {
  const font = new FontFaceObserver(fontFamily);
  return font.load(null, timeout);
}
