import { IconlyIconProps } from "./IconlyIconProps";

export const AlignBottomIcon = ({
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
                d="M3.09082 21H20.9101"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.238 17.3642H18.3041C19.5844 17.3642 20.6222 16.3264 20.6222 15.0461V10.1072C20.6222 8.82683 19.5844 7.78906 18.3041 7.78906H16.238C14.9577 7.78906 13.9199 8.82683 13.9199 10.1072V15.0461C13.9199 16.3264 14.9577 17.3642 16.238 17.3642Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.69506 17.3632H7.76111C9.04144 17.3632 10.0792 16.3254 10.0792 15.0451V5.31811C10.0792 4.03777 9.04144 3 7.76111 3H5.69506C4.41472 3 3.37695 4.03777 3.37695 5.31811V15.0451C3.37695 16.3254 4.41472 17.3632 5.69506 17.3632Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
};
