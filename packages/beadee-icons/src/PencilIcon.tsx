import { IconlyIconProps } from "./IconlyIconProps";

export const PencilIcon = ({
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
                d="M13.4414 19.8047H19.4829"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M6.98575 19.9226L8.6523 19.4378C9.54806 19.1768 10.3285 18.6192 10.8644 17.8568L17.2532 8.99764C18.018 7.94832 17.7872 6.4789 16.7379 5.71406L15.0044 4.45028C13.9553 3.68674 12.4845 3.91766 11.7208 4.96552L5.26193 13.9239C4.76904 14.6259 4.5086 15.4642 4.51577 16.3224L4.53179 18.0982C4.54389 19.369 5.76578 20.2772 6.98575 19.9226Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M10.3516 6.88086L15.8732 10.9384"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
};
