import { IconlyIconProps } from "./IconlyIconProps";

export const BrickIcon = ({
    size = 32,
    // color = "currentColor",
}: IconlyIconProps) => {
    // displayName: "BrickIcon",
    // viewBox: "0 0 32 32",
    // defaultProps: {
    //     fill: "#1A202C",
    // },
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="7.5"
                y="18"
                width="5"
                height="8"
                rx="2"
                transform="rotate(-90 7.5 18)"
                fill="currentColor"
            />
            <rect
                x="16.5"
                y="18"
                width="5"
                height="8"
                rx="2"
                transform="rotate(-90 16.5 18)"
                fill="currentColor"
            />
            <rect
                x="3"
                y="24"
                width="5"
                height="8"
                rx="2"
                transform="rotate(-90 3 24)"
                fill="#A0AEC0"
            />
            <rect
                x="12"
                y="24"
                width="5"
                height="8"
                rx="2"
                transform="rotate(-90 12 24)"
                fill="currentColor"
            />
            <rect
                x="21"
                y="24"
                width="5"
                height="8"
                rx="2"
                transform="rotate(-90 21 24)"
                fill="#A0AEC0"
            />
            <rect
                x="3"
                y="12"
                width="5"
                height="8"
                rx="2"
                transform="rotate(-90 3 12)"
                fill="#A0AEC0"
            />
            <rect
                x="12"
                y="12"
                width="5"
                height="8"
                rx="2"
                transform="rotate(-90 12 12)"
                fill="currentColor"
            />
            <rect
                x="21"
                y="12"
                width="5"
                height="8"
                rx="2"
                transform="rotate(-90 21 12)"
                fill="#A0AEC0"
            />
        </svg>
    );
};
