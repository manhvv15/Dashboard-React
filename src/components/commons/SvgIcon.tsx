import { SVGProps } from 'react';

const url = `/static/svg/system-icon.svg?v=${Date.now()}`;

interface IconSvgProps extends SVGProps<SVGSVGElement> {
  icon?: string;
  width?: number | string;
  height?: number | string;
}

const SvgIcon = ({ width = 24, height = 24, ...props }: IconSvgProps) => (
  <svg width={width} className="inline-block" height={height} {...props}>
    <use xlinkHref={`${url}#${props.icon}`} width={width} height={height} />
  </svg>
);
export default SvgIcon;
