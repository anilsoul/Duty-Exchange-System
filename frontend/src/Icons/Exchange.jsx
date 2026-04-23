import { memo } from "react";

const Exchange = () => {
    return (
        <svg className="icon" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 10L2 15l5 5v-4h8v-2H7v-4zm10 4l5-5-5-5v4H9v2h8v4z" />
        </svg>
    );
};

export default memo(Exchange);
