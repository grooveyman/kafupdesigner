import React, { useEffect, useState } from "react";
import ExternalLogin from "./ExternalLogin";
import { useApiMutation } from "../../hooks/useApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "../../components/auth/AuthLayout";
import PasswordInput from "../../components/auth/PasswordInput";
import { loginSchema, getFieldErrors } from "../../schemas/auth";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});

    //auth context
    const { login, isAuthenticated } = useAuth();

    //check if user is already logged in and redirect to home page
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
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

        const result = loginSchema.safeParse(form);
        if (!result.success) {
            setErrors(getFieldErrors(result.error));
            return;
        }

        loginMutation.mutate(result.data);
    };

    return (

        <div className="container">

            <div className="row mt-5">
                <h3 className="text-center">Login to Kafup Designer</h3>
                <div className="col-md-3"></div>
                <div className="col-md-6 mt-5">
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="kf-auth__field">
                            <label className="kf-auth__label" htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@brand.com"
                                className="form-control"
                            />
                            {errors.email && <span className="kf-auth__error">{errors.email}</span>}
                        </div>

                        <div className="kf-auth__field">
                            <label className="kf-auth__label" htmlFor="password">Password</label>
                            <PasswordInput
                                id="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                            />
                            {errors.password && <span className="kf-auth__error">{errors.password}</span>}
                        </div>

                        <a
                            href="#"
                            className="kf-auth__forgot"
                            onClick={(e) => { e.preventDefault(); navigate("/password-reset"); }}
                        >
                            Forgot Password?
                        </a>

                        <button className="kf-auth__submit" type="submit" disabled={loginMutation.isPending}>
                            {loginMutation.isPending ? "Signing in..." : "Login"}
                        </button>
                        <button className="kf-auth__ghost" type="button" onClick={() => navigate("/register")}>
                            Create Account
                        </button>

                        {/* login with Google */}
                        <ExternalLogin />
                    </form>
                </div>
                <div className="col-md-3"></div>
            </div>
        </div>

    );
};

export default Login;
