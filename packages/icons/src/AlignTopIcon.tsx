import { IconlyIconProps } from "./IconlyIconProps";

export const AlignTopIcon = ({
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
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.69495 6.63672H7.76089C9.04117 6.63672 10.0789 7.67444 10.0789 8.95471V18.6812C10.0789 19.9615 9.04117 20.9992 7.76089 20.9992H5.69495C4.41467 20.9992 3.37695 19.9615 3.37695 18.6812V8.95471C3.37695 7.67444 4.41467 6.63672 5.69495 6.63672Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.2379 6.63672H18.3039C19.5841 6.63672 20.6219 7.67444 20.6219 8.95471V13.8934C20.6219 15.1736 19.5841 16.2114 18.3039 16.2114H16.2379C14.9576 16.2114 13.9199 15.1736 13.9199 13.8934V8.95471C13.9199 7.67444 14.9576 6.63672 16.2379 6.63672Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M3.08984 3H20.9082"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
};
