import { IconlyIconProps } from "./IconlyIconProps";

export const NavigationIcon = ({
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
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.18225 4.09312L18.8187 9.22638C19.9895 9.70168 19.9011 11.3892 18.6869 11.7403L12.5419 13.5154L9.72113 19.2548C9.163 20.3899 7.48674 20.1818 7.22321 18.9461L4.3761 5.6075C4.17092 4.56654 5.194 3.71006 6.18225 4.09312Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
};
