import { IconlyIconProps } from "./IconlyIconProps";

export const ThermometerIcon = ({
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
                d="M19.8635 9.209L18.5345 10.539C19.1655 11.171 19.1655 12.195 18.5345 12.826C18.0865 13.273 17.3615 13.273 16.9145 12.826L11.1905 7.102C10.7425 6.655 10.7425 5.93 11.1905 5.482C11.8215 4.851 12.8455 4.851 13.4775 5.482L13.4785 5.483L14.9105 4.052C15.6055 3.357 16.5235 3 17.4415 3C18.4285 3 19.4015 3.399 20.1215 4.212C21.3905 5.644 21.2175 7.856 19.8635 9.209Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M11.5906 7.5L5.79958 13.291C5.52058 13.57 5.34358 13.935 5.29758 14.326L5.10958 15.911C5.06258 16.303 4.88658 16.667 4.60758 16.946L3.52758 18.026C2.84758 18.706 2.84758 19.809 3.52758 20.488C4.20758 21.168 5.31058 21.168 5.99058 20.488L7.06958 19.409C7.34858 19.13 7.71358 18.953 8.10458 18.907L9.68958 18.719C10.0816 18.672 10.4466 18.495 10.7246 18.216L16.5156 12.425"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M10.3242 15.3203L11.9732 16.9693"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M12.4531 13.1914L14.1021 14.8404"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
};
