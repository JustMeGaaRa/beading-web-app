import { IconlyIconProps } from "./IconlyIconProps";

export const DocumentPenIcon = ({
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
                d="M10.2034 16.8434L9.49775 16.9612C8.98093 17.0478 8.52446 16.6176 8.58091 16.0969L8.65975 15.3679C8.6977 15.0165 8.84467 14.6856 9.08021 14.4219L12.1568 11.065C12.5198 10.6718 13.133 10.6484 13.5262 11.0115L14.1744 11.613C14.5676 11.977 14.591 12.5892 14.2279 12.9824L11.1854 16.3023C10.9295 16.5884 10.583 16.7801 10.2034 16.8434Z"
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
        </svg>
    );
};
