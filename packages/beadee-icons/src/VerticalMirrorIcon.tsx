import { IconlyIconProps } from "./IconlyIconProps";

export const VerticalMirrorIcon = ({
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
                d="M11.998 20.6224V3.37891"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.51642 11.4632L4.11889 8.73892C3.66841 8.37698 3 8.69806 3 9.27501V14.7255C3 15.3024 3.66841 15.6225 4.11889 15.2616L7.51642 12.5373C7.85987 12.261 7.85987 11.7385 7.51642 11.4632Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.4842 12.5369L19.8817 15.2611C20.3322 15.6231 21.0006 15.302 21.0006 14.725V9.27459C21.0006 8.69763 20.3322 8.37753 19.8817 8.73849L16.4842 11.4627C16.1407 11.7391 16.1407 12.2615 16.4842 12.5369Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
};
