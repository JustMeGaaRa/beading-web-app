import { IconlyIconProps } from "./IconlyIconProps";

export const AlignRightIcon = ({
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
                d="M17.3632 18.3041V16.238C17.3632 14.9577 16.3254 13.9199 15.0451 13.9199H5.31811C4.03777 13.9199 3 14.9577 3 16.238V18.3041C3 19.5844 4.03777 20.6222 5.31811 20.6222H15.0451C16.3254 20.6222 17.3632 19.5844 17.3632 18.3041Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.3642 7.76111V5.69506C17.3642 4.41472 16.3264 3.37695 15.0461 3.37695H10.1072C8.82683 3.37695 7.78906 4.41472 7.78906 5.69506V7.76111C7.78906 9.04144 8.82683 10.0792 10.1072 10.0792H15.0461C16.3264 10.0792 17.3642 9.04144 17.3642 7.76111Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M21 20.9091V3.08984"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
};
