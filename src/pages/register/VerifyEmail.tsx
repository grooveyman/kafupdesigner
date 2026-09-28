import React, { useState } from "react";
import { useApiMutation } from "../../hooks/useApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import { verifyEmailSchema, getFieldErrors } from "../../schemas/auth";

const VerifyEmail: React.FC = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    const mutation = useApiMutation<{ message: string }>(
        "/designer/verify-email",
        "POST",
        {
            onSuccess: (data) => {
                toast.success(data.message);
                navigate("/login");
            },
            onError: (data) => {
                toast.error(data.message);
            }
        }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = verifyEmailSchema.safeParse({ code });
        if (!result.success) {
            setError(getFieldErrors(result.error).code ?? "");
            return;
        }

        mutation.mutate(result.data);
    };

    return (
        <AuthLayout
            title="Verify your email"
            subtitle="We emailed you a code to verify your email address. Enter it below to confirm."
            quote={{
                text: "Good design is obvious. Great design is transparent.",
                author: "Joe Sparano",
            }}
        >
            <form onSubmit={handleSubmit} noValidate>
                <div className="kf-auth__field">
                    <label className="kf-auth__label" htmlFor="code">Verification code</label>
                    <input
                        id="code"
                        type="text"
                        placeholder="Enter code"
                        className="form-control"
                        name="code"
                        value={code}
                        onChange={(e) => { setCode(e.target.value); setError(""); }}
                    />
                    {error && <span className="kf-auth__error">{error}</span>}
                </div>

                <button className="kf-auth__submit" type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Verifying..." : "Verify Email"}
                </button>
                <button className="kf-auth__ghost" type="button" onClick={() => navigate("/login")}>
                    Back to login
                </button>
            </form>
        </AuthLayout>
    );
};

export default VerifyEmail;
