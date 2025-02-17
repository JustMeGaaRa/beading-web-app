import { IconlyIconProps } from "./IconlyIconProps";

export const DragIcon = ({
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
                d="M19.1378 11.6721C20.0948 14.2554 19.1532 17.6737 17.4762 19.3507C15.3364 21.4905 9.35656 21.6531 7.39883 19.2186C6.15648 17.6737 5.19089 15.7987 4.58223 14.1187C4.25579 13.2177 4.7348 12.246 5.62958 11.9028C6.42164 11.599 7.31871 11.877 7.80014 12.5755L9.00235 14.3197V4.68044C9.00235 3.75236 9.75471 3 10.6828 3C11.6008 3 12.3489 3.73672 12.363 4.65463L12.4298 9.00213C14.7815 9.22671 18.1868 9.10538 19.1378 11.6721Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M5.5 4L4 5.5L5.5 7"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M19 5.5C19 6.32843 18.3284 7 17.5 7C16.6716 7 16 6.32843 16 5.5C16 4.67157 16.6716 4 17.5 4C18.3284 4 19 4.67157 19 5.5Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M12.5 5.5H16"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M4 5.5H9"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
};
