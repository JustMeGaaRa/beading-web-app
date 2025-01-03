import { IconlyIconProps } from "./IconlyIconProps";

export const ReverseRightIcon = ({
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
                d="M16.9453 11.4393C18.1378 10.2469 18.8062 9.57781 19.9986 8.38534C18.8062 7.19381 18.1378 6.5245 16.9453 5.33203"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M20 8.38672H9.14259C6.30306 8.38672 4 10.6898 4 13.5293C4 16.3698 6.30306 18.6728 9.14259 18.6728H17.5802"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
};
