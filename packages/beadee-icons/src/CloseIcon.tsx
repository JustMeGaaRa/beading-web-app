import { IconlyIconProps } from "./IconlyIconProps";

export const CloseIcon = ({
    size = 24,
    color = "currentColor",
    stroke = "1.5",
}: IconlyIconProps) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M6 6L18 18"
                stroke={color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M18 6L6 18"
                stroke={color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
};
