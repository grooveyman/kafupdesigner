import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApiMutation } from "../../hooks/useApi";
import { toast } from "react-toastify";
import AuthLayout from "../../components/auth/AuthLayout";
import PasswordInput from "../../components/auth/PasswordInput";
import { registerSchema, getFieldErrors } from "../../schemas/auth";

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [registerData, setRegisterData] = useState({
        brand_name: "",
        contact_email: "",
        brand_description: "",
        phone_number: "",
        business_location: "",
        password: "",
        contact_name: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const mutation = useApiMutation<{ message: string }>(
        "/designer/register",
        "POST",
        {
            onSuccess: (data) => {
                toast.success(data.message);
                navigate("/verify-email");
            },
            onError: (data) => {
                toast.error(data.message);
            }
        }
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setRegisterData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = registerSchema.safeParse(registerData);
        if (!result.success) {
            setErrors(getFieldErrors(result.error));
            return;
        }

        const keyMap: Record<string, string> = {
            brand_name: "brand_name",
            contact_email: "contact_email",
            brand_description: "pitch",
            phone_number: "contact_phone",
            business_location: "business_location",
            password: "password",
            contact_name: "contact_name",
        };
        const payload: Record<string, string> = {};
        Object.entries(result.data).forEach(([key, value]) => {
            payload[keyMap[key] ?? key] = value;
        });

        mutation.mutate(payload);
    };

    return (
        <AuthLayout
            title="Get started as a designer"
            subtitle="Create a profile, launch your brand and grow your network on Kafup."
            formSide="right"
            quote={{
                text: "Creativity is intelligence having fun.",
                author: "Albert Einstein",
            }}
        >
            <form onSubmit={handleSubmit} noValidate>
                <div className="kf-auth__row">
                    <div className="kf-auth__field">
                        <input type="text" placeholder="Brand name" className="form-control" name="brand_name" value={registerData.brand_name} onChange={handleInputChange} />
                        {errors.brand_name && <span className="kf-auth__error">{errors.brand_name}</span>}
                    </div>
                    <div className="kf-auth__field">
                        <input type="text" placeholder="Contact person name" className="form-control" name="contact_name" value={registerData.contact_name} onChange={handleInputChange} />
                        {errors.contact_name && <span className="kf-auth__error">{errors.contact_name}</span>}
                    </div>
                </div>

                <div className="kf-auth__field">
                    <textarea placeholder="Tell us about your brand. NB: this is your pitch" className="form-control" name="brand_description" value={registerData.brand_description} onChange={handleInputChange} rows={3}></textarea>
                    {errors.brand_description && <span className="kf-auth__error">{errors.brand_description}</span>}
                </div>

                <div className="kf-auth__field">
                    <input type="email" placeholder="Email address" className="form-control" name="contact_email" value={registerData.contact_email} onChange={handleInputChange} />
                    {errors.contact_email
                        ? <span className="kf-auth__error">{errors.contact_email}</span>
                        : <p className="kf-auth__fine">You may receive notifications and updates about your account on this email.</p>}
                </div>

                <div className="kf-auth__row">
                    <div className="kf-auth__field">
                        <input type="text" placeholder="Phone number" className="form-control" name="phone_number" value={registerData.phone_number} onChange={handleInputChange} />
                        {errors.phone_number && <span className="kf-auth__error">{errors.phone_number}</span>}
                    </div>
                    <div className="kf-auth__field">
                        <input type="text" placeholder="Business location" className="form-control" name="business_location" value={registerData.business_location} onChange={handleInputChange} />
                        {errors.business_location && <span className="kf-auth__error">{errors.business_location}</span>}
                    </div>
                </div>

                <div className="kf-auth__field">
                    <PasswordInput placeholder="Password" name="password" value={registerData.password} onChange={handleInputChange} />
                    {errors.password && <span className="kf-auth__error">{errors.password}</span>}
                </div>

                <p className="kf-auth__legal">
                    By tapping Submit, you agree to create an account and to Kafup's Terms, Privacy Policy and Cookie Policy. The Privacy Policy describes how we use the information we collect to provide, personalise and improve our services for you.
                </p>

                <button className="kf-auth__submit" type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Submitting..." : "Submit"}
                </button>
                <button className="kf-auth__ghost" type="button" onClick={() => navigate("/login")}>
                    I already have an account
                </button>
            </form>
        </AuthLayout>
    );
};

export default Register;
