import React from 'react';
import cn from 'classnames';
import { TypeBackground } from '@mui/material/styles/createPalette';

import { makeStyles, useTheme } from 'core/styles';

type BackgroundImage = {
  imageUrl?: string;
  image?: string;
  size?: string;
  position?: string;
};

type HexColor = `#${string}`;

type Props = {
  children?: React.ReactNode;
  className?: string;
  bgColor?: keyof TypeBackground | HexColor;
  bgImage?: BackgroundImage;
};

export function DecoratedCard(props: Props) {
  const { className, children, bgColor = 'paperLight', bgImage } = props;
  const theme = useTheme();
  const bgColorString = theme.palette.background[bgColor as keyof TypeBackground] || bgColor;

  const classes = useStyles({ ...bgImage, color: bgColorString });

  return (
    <div className={cn(classes.root, className)}>
      {children}

      {/* image not showing up on mobile devices. 
            svg + background-image + border-radius>0 + overflow:hidden? + background-repeat:no-repeat + chrome-mobile */}
      {bgImage?.imageUrl && <div className={classes.background} />}
    </div>
  );
}

type StylesProps = BackgroundImage & { color: string };

const useStyles = makeStyles(
  () => ({
    root: {
      position: 'relative',
      backgroundColor: ({ color }: StylesProps) => color,
      borderRadius: 6,
      padding: 20,
      height: '100%',
      overflow: 'hidden',
      zIndex: 0,
    },

    background: ({ imageUrl, image, size, position }: StylesProps) => ({
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: -1,

      position: 'absolute',
      pointerEvents: 'none',

      backgroundImage: [imageUrl && `url(${imageUrl})`, image].filter(Boolean).join(', '),
      backgroundRepeat: 'no-repeat',
      backgroundPosition: position || 'right bottom 0%',
      backgroundSize: size || 'auto',
    }),
  }),
  { name: 'DecoratedCard' },
);
