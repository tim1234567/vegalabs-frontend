declare namespace NodeJS {
  interface ProcessEnv {
    NETWORK: 'mainnet' | 'testnet';
  }
}

declare module '*.eot' {
  const url: string;
  // eslint-disable-next-line import/no-default-export
  export default url;
}
declare module '*.woff' {
  const url: string;
  // eslint-disable-next-line import/no-default-export
  export default url;
}

declare module '*.woff2' {
  const url: string;
  // eslint-disable-next-line import/no-default-export
  export default url;
}

declare module '*.ttf' {
  const url: string;
  // eslint-disable-next-line import/no-default-export
  export default url;
}

declare module '*.pdf' {
  const url: string;
  // eslint-disable-next-line import/no-default-export
  export default url;
}

declare module '*.html' {
  const url: string;
  // eslint-disable-next-line import/no-default-export
  export default url;
}

// TODO remove types below when this bug will be fixed: https://github.com/vercel/next.js/pull/30060

interface StaticImageData {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
}

declare module '*.png' {
  const content: StaticImageData;

  // eslint-disable-next-line import/no-default-export
  export default content;
}

declare module '*.svg' {
  const content: StaticImageData;

  // eslint-disable-next-line import/no-default-export
  export default content;
}

declare module '*.jpg' {
  const content: StaticImageData;

  // eslint-disable-next-line import/no-default-export
  export default content;
}

declare module '*.jpeg' {
  const content: StaticImageData;

  // eslint-disable-next-line import/no-default-export
  export default content;
}

declare module '*.gif' {
  const content: StaticImageData;

  // eslint-disable-next-line import/no-default-export
  export default content;
}

declare module '*.webp' {
  const content: StaticImageData;

  // eslint-disable-next-line import/no-default-export
  export default content;
}

declare module '*.ico' {
  const content: StaticImageData;

  // eslint-disable-next-line import/no-default-export
  export default content;
}

declare module '*.bmp' {
  const content: StaticImageData;

  // eslint-disable-next-line import/no-default-export
  export default content;
}
