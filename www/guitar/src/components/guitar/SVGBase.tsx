import * as stylex from "@stylexjs/stylex";
import React from "react";

export type SVGBaseProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  xstyle?: stylex.StyleXStyles;
  viewBox?: string;
  aspectRatio?: number;
};

export default function SVGBase({ 
  children, 
  xstyle, 
  viewBox = "0 0 100 100", 
  aspectRatio, 
  ...props 
}: SVGBaseProps) {
  const stylexProps = stylex.props(styles.container, xstyle);

  return (
    <div 
      {...props} 
      {...stylexProps} 
      style={{ 
        ...stylexProps.style,
        aspectRatio: aspectRatio ? String(aspectRatio) : undefined 
      }}
    >
      <svg 
        {...stylex.props(styles.svg)} 
        preserveAspectRatio="xMidYMid meet"
        viewBox={viewBox}
      >
        {children}
      </svg>
    </div>
  );
}

const styles = stylex.create({
  container: {
    position: 'relative',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    maxInlineSize: '100%',
  }
});