import { IconlyIconProps } from "./IconlyIconProps";

export const CutTweezersIcon = ({
    size = 24,
    color = "currentColor",
}: IconlyIconProps) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.21884 9.6955C9.51532 9.6955 10.5666 8.64423 10.5666 7.34775C10.5666 6.05127 9.51532 5 8.21884 5C6.92236 5 5.87109 6.05127 5.87109 7.34775C5.87109 8.64423 6.92236 9.6955 8.21884 9.6955Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.21884 14.3045C9.51532 14.3045 10.5666 15.3558 10.5666 16.6523C10.5666 17.9487 9.51532 19 8.21884 19C6.92236 19 5.87109 17.9487 5.87109 16.6523C5.87109 15.3558 6.92236 14.3045 8.21884 14.3045Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M19.7981 17.8419L10.0508 8.80469"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M19.7981 6.15625L10.0508 15.1934"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
};
