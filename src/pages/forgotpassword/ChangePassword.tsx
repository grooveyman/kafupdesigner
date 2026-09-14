import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useApiMutation } from "../../hooks/useApi";
import { useState } from "react";
import { toast } from "react-toastify";


const ChangePassword: React.FC = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    }

    const navigate = useNavigate();

    const mutation = useApiMutation<{ message: string }>(
        "/users/auth/reset-password",
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
    )

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        mutation.mutate({ newPassword: password, token });
    };

    return (
        <>
            <div className="container">
                <div className="row mt-5">
                    <div className="col-md-3"></div>
                    <div className="col-md-6">
                        <div className="change-password-card">
                            <h4>Change Password</h4>
                            <p>Enter your new password below.</p>
                            <form onSubmit={handleSubmit}>
                                <input type="password" placeholder="Enter your new password" className="form-control mb-3" name="password" onChange={handlePasswordChange} />
                                <input type="password" placeholder="Confirm your new password" className="form-control mb-3" name="confirmPassword" onChange={handleConfirmPasswordChange} />
                                <button className="btn btn-secondary w-100 h-full p-3" type="submit">
                                    Change Password
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="col-md-3"></div>
                </div>
            </div>
        </>
    );
}

export default ChangePassword;