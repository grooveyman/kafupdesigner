
import { useNavigate } from "react-router-dom";
import "./style.css";
import { useState } from "react";
import { useApiMutation } from "../../hooks/useApi";
import { toast } from "react-toastify";

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [registerData, setRegisterData] = useState({
        brandName: "",
        emailAddress: "",
        brandDescription: "",
        phoneNumber: "",
        businessLocation: "",
        password: "",
        contactPerson:"",
    });

    const mutation = useApiMutation<{ message: string }>(
        "/designers/register",
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
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const keyMap: Record<string, string> = {
            brandName: "brand_name",
            emailAddress: "contact_email",
            brandDescription: "pitch",
            phoneNumber: "contact_phone",
            businessLocation: "business_location",
            password: "password",
            contactPerson: "contact_name"
        }
        const payload: Record<string, string> = {};
        Object.entries(registerData).forEach(([key, value]) => {
            payload[keyMap[key] ?? key] = value;
        });
        console.log("payload", payload);
        console.log("registerData", registerData);

        mutation.mutate(payload);

    }
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-6 col-xs-12 col-sm-12 col-lg-6 col-xl-6 col-xxl-6 col-12">
                        <form className="register-form">
                            <div className="register-card">
                                <h4>Get started as a designer on Kafup</h4>
                                <p>Creat a profile and a launch a brand, porfolio and increase your network.</p>
                                <div className="row">
                                    <div className="col-md-6">
                                        <input type="text" placeholder="Brand Name" className="form-control mb-3" name="brandName" value={registerData.brandName} onChange={handleInputChange} />
                                    </div>
                                     <div className="col-md-6">
                                        <input type="text" placeholder="Contact Person Name" className="form-control mb-3" name="contactPerson" value={registerData.contactPerson} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <textarea placeholder="Tell us about your brand. NB: This your pitch" className="form-control mb-3" name="brandDescription" value={registerData.brandDescription} onChange={handleInputChange} rows={4}></textarea>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <input type="text" placeholder="Email Address" className="form-control mb-3" name="emailAddress" value={registerData.emailAddress} onChange={handleInputChange} />
                                        <p className="text-xs">You may receive notifications and updates about your account on this email.</p>
                                    </div>
                                   
                                    
                                </div>
                                
                                <div className="row">
                                    <div className="col-md-6">
                                        <input type="text" placeholder="Phone Number" className="form-control mb-3" name="phoneNumber" value={registerData.phoneNumber} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <input type="text" placeholder="Business Location" className="form-control mb-3" name="businessLocation" value={registerData.businessLocation} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <input type="password" placeholder="password" className="form-control mb-3" name="password" value={registerData.password} onChange={handleInputChange} />
                                    </div>
                                </div>

                                <p>
                                    By tapping Submit, you agree to create an account and to Kafup's Terms, Privacy Policy and Cookie Policy.
                                </p>
                                <p>
                                    The Privacy Policy describes the ways we can use the information we collect when you create an account. For example, we use this information to provide, personalise and improve our services for you.
                                </p>

                                <button className="btn btn-secondary w-100 h-full p-3" type="submit" onClick={handleSubmit}>
                                    Submit
                                </button>
                                <button className="btn btn-tertiary w-100 h-full p-3 mt-3" type="button" onClick={() => navigate("/login")}>
                                    I already have an account
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-3"></div>
                </div>
            </div>
        </>
    );
}

export default Register;