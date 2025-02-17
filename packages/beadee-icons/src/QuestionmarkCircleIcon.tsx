import { IconlyIconProps } from "./IconlyIconProps";

export const QuestionmarkCircleIcon = ({
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
                d="M21 12C21 7.02908 16.9709 3 12 3C7.02908 3 3 7.02908 3 12C3 16.9699 7.02908 21 12 21C16.9709 21 21 16.9699 21 12Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M11.9473 16.2245V16.1963"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M11.9462 13.7496C11.9345 12.8583 12.745 12.4808 13.3473 12.1373C14.0819 11.7326 14.5791 11.0875 14.5791 10.1933C14.5791 8.86815 13.5078 7.80469 12.1914 7.80469C10.8662 7.80469 9.80273 8.86815 9.80273 10.1933"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
};
