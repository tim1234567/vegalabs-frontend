import React from 'react';
import NextImage from 'next/image';
import cn from 'classnames';

import { makeStyles } from 'core/styles';

type FontSize = 'inherit' | 'default' | 'small' | 'large';

export type NextSvgIconProps = {
  image: StaticImageData;
  alt?: string;
  className?: string;
  fontSize?: FontSize;
};

export function NextSvgIcon({ image, alt, className, fontSize = 'default' }: NextSvgIconProps) {
  const classes = useStyles(image);

  return (
    <div className={cn(classes.imgContainer, fontSize && classes[fontSize], className)}>
      <NextImage
        src={image}
        objectPosition="center center"
        objectFit="contain"
        layout="fill"
        alt={alt}
      />
    </div>
  );
}

const useStyles = makeStyles(
  theme => ({
    imgContainer: {
      position: 'relative',
      width: ({ height, width }: StaticImageData) =>
        `${Math.round((width / height) * 100) / 100}em`,
      height: '1em',
      fontSize: theme.typography.pxToRem(20),

      '&$inherit': {
        fontSize: 'inherit',
      },

      '&$small': {
        fontSize: theme.typography.pxToRem(16),
      },

      '&$large': {
        fontSize: theme.typography.pxToRem(24),
      },
    },

    inherit: {},
    small: {},
    default: {},
    large: {},
  }),
  { name: 'SvgIcon' },
);
