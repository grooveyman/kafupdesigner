import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useApiMutation } from "../../hooks/useApi";
import AuthLayout from "../../components/auth/AuthLayout";
import { sendResetSchema, getFieldErrors } from "../../schemas/auth";

const SendReset: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const mutation = useApiMutation<{ message: string }>(
        "/designer/request-password-reset",
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

        const result = sendResetSchema.safeParse({ email });
        if (!result.success) {
            setError(getFieldErrors(result.error).email ?? "");
            return;
        }

        mutation.mutate(result.data);
    };

    return (
        <AuthLayout
            title="Forgot your password?"
            subtitle="We will email you a link to reset your password if your account exists with us."
            quote={{
                text: "Simplicity is the ultimate sophistication.",
                author: "Leonardo da Vinci",
            }}
        >
            <form onSubmit={handleSubmit} noValidate>
                <div className="kf-auth__field">
                    <label className="kf-auth__label" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="you@brand.com"
                        className="form-control"
                        name="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    />
                    {error && <span className="kf-auth__error">{error}</span>}
                </div>

                <button className="kf-auth__submit" type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Sending..." : "Send Reset Link"}
                </button>
                <button className="kf-auth__ghost" type="button" onClick={() => navigate("/login")}>
                    Back to login
                </button>
            </form>
        </AuthLayout>
    );
};

export default SendReset;
