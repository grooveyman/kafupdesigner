import { useNavigate, useSearchParams } from "react-router-dom";
import { useApiMutation } from "../../hooks/useApi";
import { useState } from "react";
import { toast } from "react-toastify";
import AuthLayout from "../../components/auth/AuthLayout";
import PasswordInput from "../../components/auth/PasswordInput";
import { changePasswordSchema, getFieldErrors } from "../../schemas/auth";

const ChangePassword: React.FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ password: "", confirmPassword: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const mutation = useApiMutation<{ message: string }>(
        "/designer/reset-password",
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = changePasswordSchema.safeParse(form);
        if (!result.success) {
            setErrors(getFieldErrors(result.error));
            return;
        }

        if (!token) {
            toast.error("Reset link is invalid or has expired");
            return;
        }

        mutation.mutate({ newPassword: result.data.password, token });
    };

    return (
        <AuthLayout
            title="Set a new password"
            subtitle="Enter and confirm your new password below."
            formSide="right"
            quote={{
                text: "The details are not the details. They make the design.",
                author: "Charles Eames",
            }}
        >
            <form onSubmit={handleSubmit} noValidate>
                <div className="kf-auth__field">
                    <label className="kf-auth__label" htmlFor="password">New password</label>
                    <PasswordInput
                        id="password"
                        placeholder="Enter your new password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                    />
                    {errors.password && <span className="kf-auth__error">{errors.password}</span>}
                </div>

                <div className="kf-auth__field">
                    <label className="kf-auth__label" htmlFor="confirmPassword">Confirm password</label>
                    <PasswordInput
                        id="confirmPassword"
                        placeholder="Confirm your new password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                    />
                    {errors.confirmPassword && <span className="kf-auth__error">{errors.confirmPassword}</span>}
                </div>

                <button className="kf-auth__submit" type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Updating..." : "Change Password"}
                </button>
                <button className="kf-auth__ghost" type="button" onClick={() => navigate("/login")}>
                    Back to login
                </button>
            </form>
        </AuthLayout>
    );
};

export default ChangePassword;
