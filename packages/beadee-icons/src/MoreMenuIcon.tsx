import { IconlyIconProps } from "./IconlyIconProps";

export const MoreMenuIcon = ({
    size = 24,
    color = "currentColor",
}: IconlyIconProps) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12.4503 18.8014L12.3863 18.8014M12.4365 19.0606C12.2925 19.0606 12.1757 18.9438 12.1757 18.7998C12.1757 18.6557 12.2925 18.5391 12.4365 18.5391C12.5805 18.5391 12.6973 18.6557 12.6973 18.7998C12.6973 18.9438 12.5805 19.0606 12.4365 19.0606Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M12.4503 12.7779L12.3863 12.7779M12.4365 13.0372C12.2925 13.0372 12.1757 12.9203 12.1757 12.7763C12.1757 12.6323 12.2925 12.5156 12.4365 12.5156C12.5805 12.5156 12.6973 12.6323 12.6973 12.7763C12.6973 12.9203 12.5805 13.0372 12.4365 13.0372Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M12.4503 6.75839L12.3863 6.75839M12.4365 7.01765C12.2925 7.01765 12.1757 6.90081 12.1757 6.75679C12.1757 6.61278 12.2925 6.49609 12.4365 6.49609C12.5805 6.49609 12.6973 6.61278 12.6973 6.75679C12.6973 6.90081 12.5805 7.01765 12.4365 7.01765Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
};
