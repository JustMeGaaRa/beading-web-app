import { IconlyIconProps } from "./IconlyIconProps";

export const ReverseLeftIcon = ({
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
                d="M7.05318 11.4393C5.86071 10.2469 5.19247 9.57781 4 8.38534C5.19247 7.19381 5.86071 6.5245 7.05318 5.33203"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M4 8.38672H14.8574C17.6969 8.38672 20 10.6898 20 13.5293C20 16.3698 17.6969 18.6728 14.8574 18.6728H6.41976"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
};
