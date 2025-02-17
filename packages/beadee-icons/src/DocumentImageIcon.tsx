import { IconlyIconProps } from "./IconlyIconProps";

export const DocumentImageIcon = ({
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
                d="M7.84375 15.8241L9.05647 14.5462C9.26962 14.3213 9.62778 14.3262 9.83412 14.5569L10.8376 15.6742C11.0517 15.9127 11.4274 15.9068 11.6357 15.6616L13.7117 13.2108C13.9141 12.9714 14.2791 12.9597 14.4962 13.1855L16.1537 14.9034"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M13.7857 3.00004C14.3434 3.00004 14.8777 3.22681 15.2641 3.62975L19.055 7.57935C19.422 7.96088 19.6264 8.46991 19.6264 8.99937V17.1633C19.641 19.2199 18.0234 20.9163 15.9697 21L8.04424 20.999C5.97114 20.9533 4.32823 19.2364 4.37398 17.1633V6.65667C4.42264 4.61764 6.09378 2.99128 8.13379 3.00004H13.7857Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M14.2695 3.0625V5.95511C14.2686 7.36637 15.4112 8.51291 16.8234 8.51583H19.5623"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M9.25494 11.192L9.19096 11.192M9.24119 11.4512C9.09717 11.4512 8.98042 11.3344 8.98042 11.1904C8.98042 11.0464 9.09717 10.9297 9.24119 10.9297C9.38521 10.9297 9.50195 11.0464 9.50195 11.1904C9.50195 11.3344 9.38521 11.4512 9.24119 11.4512Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
};
