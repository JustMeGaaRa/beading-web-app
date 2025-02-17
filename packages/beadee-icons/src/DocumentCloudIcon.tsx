import { IconlyIconProps } from "./IconlyIconProps";

export const DocumentCloudIcon = ({
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
                d="M19.4333 12.4719V8.95363C19.4333 8.4292 19.2299 7.92423 18.866 7.54574L15.1035 3.62565C14.7192 3.22576 14.1899 3.00004 13.6353 3.00004H8.02618C6.00143 2.99128 4.34252 4.60543 4.29387 6.63018V17.0575C4.24911 19.1153 5.87981 20.819 7.93666 20.8637"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M14.1152 3.0625V5.93373C14.1143 7.3348 15.2487 8.4722 16.6498 8.47512H19.3693"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.6769 16.8248C11.5288 16.8346 10.6084 17.6373 10.6016 18.9187C10.5977 19.7681 11.1075 20.4988 11.8343 20.8276C12.1398 20.9512 12.4444 20.9998 12.675 20.9998H17.6284C17.8599 20.9998 18.1654 20.9541 18.4748 20.8305C19.2017 20.5017 19.7057 19.7681 19.7057 18.9187C19.7057 17.6061 18.7784 16.8346 17.6303 16.8248C17.6303 15.9988 16.9833 14.3477 15.1541 14.3477C13.3249 14.3477 12.6769 15.9988 12.6769 16.8248Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
};
