import { IconlyIconProps } from "./IconlyIconProps";

export const ColorPickerIcon = ({
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
                d="M7.37096 8.93713L7.28174 8.6957C6.94537 7.78532 6.22865 7.06754 5.31957 6.73067L5.07853 6.64133L5.31957 6.55199C6.22865 6.21512 6.94537 5.49734 7.28174 4.58696L7.37096 4.3455L7.46017 4.58696C7.79654 5.49734 8.51326 6.21512 9.42234 6.55199L9.66345 6.64133L9.42234 6.73067C8.51326 7.06754 7.79654 7.78532 7.46017 8.6957L7.37096 8.93713Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M4.03928 13.1302C3.88771 12.6315 3.49801 12.2413 3.00007 12.0895C3.49801 11.9377 3.88771 11.5474 4.03928 11.0487C4.19084 11.5474 4.58054 11.9377 5.07849 12.0895C4.58054 12.2413 4.19084 12.6315 4.03928 13.1302Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M14.9069 7.64124L19.2363 10.8228"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M16.108 5.78396C17.0894 4.45007 18.4504 5.16438 19.4802 5.92205C20.5099 6.67971 21.5969 7.76646 20.6155 9.10035L13.3954 18.5286C13.0972 18.9339 12.6494 19.2033 12.1516 19.277L9.64827 19.6476C9.30659 19.6982 8.98803 19.4638 8.93464 19.1225L8.54344 16.6223C8.46566 16.1252 8.58965 15.6175 8.88787 15.2122L16.108 5.78396Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
};
