import { IconlyIconProps } from "./IconlyIconProps";

export const DocumentUploadIcon = ({
    size = 24,
    color = "currentColor",
}: IconlyIconProps) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
        >
            <g
                stroke="none"
                strokeWidth="1.5"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <g
                    transform="translate(3.500000, 2.000000)"
                    stroke={color}
                    strokeWidth="1.5"
                >
                    <path
                        d="M11.2366,0.761771154 L4.5846,0.761771154 C2.5046,0.7538 0.8006,2.4108 0.7506,4.4908 L0.7506,15.2278 C0.7056,17.3298 2.3736,19.0698 4.4746,19.1148 C4.5116,19.1148 4.5486,19.1158 4.5846,19.1148 L12.5726,19.1148 C14.6626,19.0408 16.3146,17.3188 16.302665,15.2278 L16.302665,6.0378 L11.2366,0.761771154 Z"
                        id="Stroke-1"
                    ></path>
                    <path
                        d="M10.9749,0.7501 L10.9749,3.6591 C10.9749,5.0791 12.1239,6.2301 13.5439,6.2341 L16.2979,6.2341"
                        id="Stroke-3"
                    ></path>
                    <line
                        x1="8.1409"
                        y1="7.9088"
                        x2="8.1409"
                        y2="13.9498"
                        id="Stroke-5"
                    ></line>
                    <polyline
                        id="Stroke-7"
                        points="10.4866 10.2643 8.1416 7.9093 5.7966 10.2643"
                    ></polyline>
                </g>
            </g>
        </svg>
    );
};
