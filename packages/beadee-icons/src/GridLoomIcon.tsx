import { IconlyIconProps } from "./IconlyIconProps";

export const LoomIcon = ({
    size = 32,
    // color = "currentColor",
}: IconlyIconProps) => {
    // displayName: "LoomIcon",
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
            <rect x="7.5" y="3" width="5" height="8" rx="2" fill="#A0AEC0" />
            <rect x="7.5" y="12" width="5" height="8" rx="2" fill="#A0AEC0" />
            <rect x="7.5" y="21" width="5" height="8" rx="2" fill="#A0AEC0" />
            <rect
                x="13.5"
                y="3"
                width="5"
                height="8"
                rx="2"
                fill="currentColor"
            />
            <rect
                x="13.5"
                y="12"
                width="5"
                height="8"
                rx="2"
                fill="currentColor"
            />
            <rect
                x="13.5"
                y="21"
                width="5"
                height="8"
                rx="2"
                fill="currentColor"
            />
            <rect x="19.5" y="3" width="5" height="8" rx="2" fill="#A0AEC0" />
            <rect x="19.5" y="12" width="5" height="8" rx="2" fill="#A0AEC0" />
            <rect x="19.5" y="21" width="5" height="8" rx="2" fill="#A0AEC0" />
        </svg>
    );
};
