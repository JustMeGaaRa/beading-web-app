import { IconlyIconProps } from "./IconlyIconProps";

export const CloudRefreshIcon = ({
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
                d="M18.5637 16.9264C19.9998 16.2774 21 14.8316 21 13.1522C21 10.5563 19.1698 9.01317 16.897 9.01123C16.897 7.37858 15.6165 4.11328 12 4.11328C8.38346 4.11328 7.10303 7.37858 7.10303 9.01123C4.83308 9.03166 3 10.5563 3 13.1522C3 14.8316 3.99924 16.2774 5.43632 16.9264"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M11.4985 18.4076L10.0391 19.1481C10.5615 19.6102 11.2485 19.8895 12.0006 19.8895C13.6371 19.8895 14.9652 18.5623 14.9652 16.9258"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M12.5019 15.4428L13.9613 14.7014C13.4388 14.2402 12.7519 13.9609 11.9998 13.9609C10.3633 13.9609 9.03516 15.2881 9.03516 16.9246"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
};
