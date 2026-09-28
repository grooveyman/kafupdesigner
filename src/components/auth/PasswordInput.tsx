import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type"
>;

/** Text input pre-wired with a show/hide eye toggle. */
const PasswordInput: React.FC<PasswordInputProps> = ({
    className,
    ...rest
}) => {
    const [visible, setVisible] = useState(false);

    return (
        <div className="kf-auth__password">
            <input
                {...rest}
                type={visible ? "text" : "password"}
                className={`form-control ${className ?? ""}`.trim()}
            />
            <button
                type="button"
                className="kf-auth__eye"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? "Hide password" : "Show password"}
                tabIndex={-1}
            >
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );
};

export default PasswordInput;
