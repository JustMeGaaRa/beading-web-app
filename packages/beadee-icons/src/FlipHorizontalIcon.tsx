import { IconlyIconProps } from "./IconlyIconProps";

export const FlipHorizontalIcon = ({
    size = 24,
    color = "currentColor",
}: IconlyIconProps) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M5.5 14.7656L19.5 14.7656L19.5 16.0354L5.5 21.7656L5.5 14.7656Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M5.5 10.7656L19.5 10.7656L19.5 9.49586L5.5 3.76562L5.5 10.7656Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
};
