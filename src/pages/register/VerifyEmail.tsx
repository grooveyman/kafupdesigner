import React from "react";
import { useApiMutation } from "../../hooks/useApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";



const VerifyEmail:React.FC = () => {
    const [code, setCode] = React.useState("");

        const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setCode(e.target.value);
        }

        const navigate = useNavigate();

        const mutation = useApiMutation<{ message: string }>(
            "/users/auth/verifyemail",
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
        
        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            mutation.mutate({ token: code });
        }

    return (
        <>
        <div className="container">
            <div className="row mt-5">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                    <div className="verify-email-card">
                        <h4>Verify your email</h4>
                        <p>We emailed you the code to verify your email address. Enter the code below to confirm your email.</p>
                        <form onSubmit={handleSubmit}>
                            <input type="text" placeholder="Enter code" className="form-control mb-3" name="verifyCode" onChange={handleCodeChange} />
                            <button className="btn btn-secondary w-100 h-full p-3" type="submit">
                                Verify Email
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

export default VerifyEmail;