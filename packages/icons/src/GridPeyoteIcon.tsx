import { IconlyIconProps } from "./IconlyIconProps";

export const PeyoteIcon = ({
    size = 32,
    color = "currentColor",
}: IconlyIconProps) => {
    // displayName: "PeyoteIcon",
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
                x="18.5"
                y="24"
                width="5"
                height="8"
                rx="2"
                transform="rotate(180 18.5 24)"
                fill="currentColor"
            />
            <rect
                x="18.5"
                y="15"
                width="5"
                height="8"
                rx="2"
                transform="rotate(180 18.5 15)"
                fill="currentColor"
            />
            <rect
                x="24.5"
                y="28.5"
                width="5"
                height="8"
                rx="2"
                transform="rotate(180 24.5 28.5)"
                fill="#A0AEC0"
            />
            <rect
                x="24.5"
                y="19.5"
                width="5"
                height="8"
                rx="2"
                transform="rotate(180 24.5 19.5)"
                fill="currentColor"
            />
            <rect
                x="24.5"
                y="10.5"
                width="5"
                height="8"
                rx="2"
                transform="rotate(180 24.5 10.5)"
                fill="#A0AEC0"
            />
            <rect
                x="12.5"
                y="28.5"
                width="5"
                height="8"
                rx="2"
                transform="rotate(180 12.5 28.5)"
                fill="#A0AEC0"
            />
            <rect
                x="12.5"
                y="19.5"
                width="5"
                height="8"
                rx="2"
                transform="rotate(180 12.5 19.5)"
                fill="currentColor"
            />
            <rect
                x="12.5"
                y="10.5"
                width="5"
                height="8"
                rx="2"
                transform="rotate(180 12.5 10.5)"
                fill="#A0AEC0"
            />
        </svg>
    );
};
