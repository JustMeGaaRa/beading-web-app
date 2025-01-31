import { IconlyIconProps } from "./IconlyIconProps";

export const FlipVerticalIcon = ({
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
                d="M14.5 19.7656V5.76562H15.7698L21.5 19.7656H14.5Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M10.5 19.7656V5.76562H9.23023L3.5 19.7656H10.5Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
};
