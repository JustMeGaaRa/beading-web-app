import { IconlyIconProps } from "./IconlyIconProps";

export const CombineIcon = ({
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
                d="M11.5421 3H17.5776C19.687 3 20.9996 4.48867 20.9996 6.59617V12.2833C20.9996 14.3908 19.687 15.8795 17.5766 15.8795H11.5421C9.43268 15.8795 8.12109 14.3908 8.12109 12.2833V6.59617C8.12109 4.48867 9.43949 3 11.5421 3Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M6.422 8.12109H12.4575C14.5669 8.12109 15.8795 9.60977 15.8795 11.7173V17.4044C15.8795 19.5119 14.5669 21.0005 12.4565 21.0005H6.422C4.31256 21.0005 3 19.5119 3 17.4044V11.7173C3 9.60977 4.31937 8.12109 6.422 8.12109Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
};
