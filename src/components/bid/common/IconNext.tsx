interface Props {
  color?: string;
  onClick?: () => void;
  size?: string | number;
  className?: string;
}

export const IconNext = ({
  color = "white",
  onClick,
  size = "16",
  className,
}: Props) => {
  return (
    <div className={className} onClick={onClick}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.0573 6H1.05725"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10.0573 11L15.0573 6"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10.0573 1L15.0573 6"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
};
