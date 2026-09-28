import React, { useEffect } from "react";
import "./styles.css";
import ExternalLogin from "./ExternalLogin";
import { useApiMutation } from "../../hooks/useApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [userText, setUserText] = React.useState({
        username: "",
        password: "",
    });
    const [errors, setErrors] = React.useState({
        username: "",
        password: "",
    });

    //auth context
    const { login, isAuthenticated } = useAuth();

    //check if user is already logged in and redirect to home page
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    //validate function
    const validateInput = (name: string, value: string) => {
        if (name === "username" && value.trim() === "") {
            setErrors((prev) => ({ ...prev, username: "Username is required" }));
            return "Username is required";
        }
        if (name === "password" && value.trim() === "") {
            setErrors((prev) => ({ ...prev, password: "Password is required" }));
            return "Password is required";
        }
        setErrors((prev) => ({ ...prev, [name]: "" }));
        return null;
    };
    const handleUserTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserText((prev) => ({ ...prev, [name]: value }));

    };

    //mutation
    const loginMutation = useApiMutation<{ status: boolean; message: string; data: { email: string; brand_name: string; designer_code: string; access_token: string } }>(
        `/auth/login`,
        "POST",
        {
            onSuccess: async (res) => {
                login(res.data.designer_code);
                toast.success(res.message);
                navigate("/");
            },
            onError: (error) => {
                toast.error(error.message);
            },
        }
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const error = validateInput("username", userText.username) || validateInput("password", userText.password);

        // Handle login logic here
        if (!error) {
            loginMutation.mutate({ email: userText.username, password: userText.password });
        }
    };

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-4"></div>
                    <div className="col-md-4 col-xs-12 col-sm-12 col-lg-4 col-xl-4 col-xxl-4 col-12">
                        <form className="login-form" onSubmit={handleSubmit}>
                            <div className="login-card">
                                <input type="text" name="username" value={userText.username} onChange={handleUserTextChange} placeholder="Username" className="form-control mb-3" />
                                {errors.username && <span className="text-danger">{errors.username}</span>}
                                <input type="password" name="password" value={userText.password} onChange={handleUserTextChange} placeholder="Password" className="form-control mb-3" />
                                {errors.password && <span className="text-danger">{errors.password}</span>}

                                <div>
                                    <p className="text-right">
                                        <a href="#" className="text-decoration-none forgot" onClick={() => navigate("/password-reset")}>
                                            Forgot Password?
                                        </a>
                                    </p>
                                </div>
                                <button className="btn btn-secondary w-100 h-full p-3" type="submit">
                                    Login
                                </button>
                                <button className="btn btn-tertiary w-100 h-full p-3 my-3" type="button" onClick={() => navigate("/register")}>
                                    Create Account
                                </button>

                                {/* login with Google */}
                                <ExternalLogin />
                            </div>
                        </form>

                    </div>
                    <div className="col-md-4"></div>
                </div>
            </div>
        </>
    );
}

export default Login;
