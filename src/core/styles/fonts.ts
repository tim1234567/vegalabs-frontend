type FontFaceRule = {
  fontFamily: string;
  src: string;
  fontStyle: string;
  fontWeight: string | number;
  fontDisplay: 'auto' | 'block' | 'fallback' | 'optional' | 'swap';
};

export const fonts: FontFaceRule[] = [];
