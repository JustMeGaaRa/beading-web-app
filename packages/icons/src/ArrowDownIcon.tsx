import { IconlyIconProps } from "./IconlyIconProps";

export const ArrowDownIcon = ({
    size = 24,
    color = "currentColor",
}: IconlyIconProps) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
        >
            <title>Iconly/Light/Arrow - Down 2</title>
            <g
                id="Iconly/Light/Arrow---Down-2"
                stroke="none"
                strokeWidth="1.5"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <g
                    id="Arrow---Down-2"
                    transform="translate(5.000000, 8.500000)"
                    stroke={color}
                    strokeWidth="1.5"
                >
                    <polyline id="Stroke-1" points="14 0 7 7 0 0"></polyline>
                </g>
            </g>
        </svg>
    );
};
