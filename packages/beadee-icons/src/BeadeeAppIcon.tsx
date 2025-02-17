import { IconlyIconProps } from "./IconlyIconProps";

export const BeadeeAppIcon = ({
    size = 32,
    // color = "currentColor",
}: IconlyIconProps) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="32" height="32" rx="4" fill="#171923" />
            <rect
                x="12.5222"
                y="3.5"
                width="6.94444"
                height="11.1111"
                rx="1"
                fill="#0BC5EA"
            />
            <rect
                x="12.5222"
                y="17.3889"
                width="6.94444"
                height="11.1111"
                rx="1"
                fill="#0BC5EA"
            />
            <rect
                x="2.80005"
                y="3.5"
                width="6.94444"
                height="11.1111"
                rx="1"
                fill="#0BC5EA"
            />
            <rect
                x="22.2445"
                y="17.3889"
                width="6.94444"
                height="11.1111"
                rx="1"
                fill="#0BC5EA"
            />
        </svg>
    );
};
