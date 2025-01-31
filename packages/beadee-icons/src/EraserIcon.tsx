import { IconlyIconProps } from "./IconlyIconProps";

export const EraserIcon = ({
    size = 24,
    color = "currentColor",
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
                d="M15.9475 20.5474H20.1302M11.2216 20.4307L20.2639 11.3884C21.2454 10.4069 21.2454 8.81521 20.2639 7.8337L16.6194 4.18926C15.6379 3.20775 14.0473 3.20775 13.0657 4.18926L3.79403 13.461C2.73532 14.5197 2.73532 16.2365 3.79403 17.2952L6.23477 19.7569C6.71979 20.246 7.38005 20.5214 8.06951 20.5225L20.9919 20.5475"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M8.35938 8.89453L15.5585 16.0937"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
};
