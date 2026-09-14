import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useApiMutation } from "../../hooks/useApi";


const SendReset: React.FC = () => {

    const [email, setEmail] = useState("");

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const mutation = useApiMutation<{ message: string }>(
        "/users/auth/request-password-reset",
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

    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        mutation.mutate({ email });
    }
    return (
        <>
            <div className="container">
                <div className="row mt-5">
                    <div className="col-md-3"></div>
                    <div className="col-md-6">
                        <div className="verify-email-card">
                            <h4>Enter your email</h4>
                            <p>We will email you a link to reset your password if your account exists with us.</p>
                            <form onSubmit={handleSubmit}>
                                <input type="email" placeholder="Enter your email" className="form-control mb-3" name="email" onChange={handleEmailChange} />
                                <button className="btn btn-secondary w-100 h-full p-3" type="submit">
                                    Send Reset Link
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

export default SendReset;