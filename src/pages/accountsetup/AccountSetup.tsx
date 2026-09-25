

<<<<<<< HEAD
const AccountSetup:React.FC = () => {
    return (
        <>
            <div className="container">
                <div className="row">
                    <h5>Welcome to Kafup Designer</h5>
                    <p>Setup your account to sell and receive profits from your hard work.</p>
                </div>

                <div className="row">
                    <div className="">
                        <label>Bank Name</label>
                        <input type="text" name="bank_name" placeholder="Enter name of bank"/>
                    </div>
                </div>

            </div>
        </>
    );
=======
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useApiMutation } from "../../hooks/useApi";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const AccountSetup: React.FC = () => {
    const [showModal, setShowModal] = useState(true);
    const [showSetup, setShowSetup] = useState(false);
    const [accountData, setAccountData] = useState({
        name: "",
        branch: "",
        account_number: ""
    })

    const { isAccountSetup } = useAuth();
    console.log(isAccountSetup);

    const navigate = useNavigate();

    const mutation = useApiMutation<{ message: string }>(
        "/designer/account",
        "POST",
        {
            onSuccess: (data) => {
                toast.success(data.message);
                //update account setup
                localStorage.setItem("is_account_setup", "true");
                navigate("/");
            },
            onError: (data) => {
                toast.error(data.message);
            }
        }
    );

    const handleYes = () => {
        setShowModal(false);
        setShowSetup(true);
    };

    const handleNo = () => {
        setShowModal(false);
        navigate("/");
    };

    const handleAccount = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("payload", accountData);
        mutation.mutate(accountData);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAccountData((prev) => ({ ...prev, [name]: value }));
    }

    return isAccountSetup ? (
         <Navigate to="/" />
    ) : (

        <>
            {showSetup && (
                <div className="container">
                    <div className="row mt-5">
                        <div className="col-md-3" />
                        <div className="col-md-6">
                            <h5>Welcome to Kafup Designer</h5>
                            <p>Setup your account to sell and receive profits from your hard work.</p>
                            <form>
                                <div className="row">
                                    <div className="col-md-6">
                                        <label htmlFor="bank-name">Bank Name</label>
                                        <input
                                            className="form-control"
                                            id="bank-name"
                                            type="text"
                                            name="name"
                                            placeholder="Enter name of bank"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="bank-branch">Bank Branch</label>
                                        <input
                                            className="form-control"
                                            id="bank-branch"
                                            type="text"
                                            name="branch"
                                            placeholder="Enter branch of bank"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <label htmlFor="bank-account">Account Number</label>
                                    <input
                                        className="form-control"
                                        id="bank-account"
                                        type="text"
                                        name="account_number"
                                        placeholder="Enter bank account number"
                                        onChange={handleChange}
                                    />
                                </div>

                                <button type="button" onClick={handleAccount} className="form-control btn btn-secondary mt-2">
                                    Submit
                                </button>
                            </form>

                        </div>
                        <div className="col-md-3" />
                    </div>
                </div>
            )}

            {showModal && (
                <>
                    <div
                        className="modal fade show d-block"
                        tabIndex={-1}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="account-setup-title"
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="account-setup-title">
                                        Sell your designs
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={handleNo}
                                    />
                                </div>
                                <div className="modal-body text-center">
                                    <p>Do you want to sell your designs for profit on Kafup?</p>
                                    <button type="button" className="btn btn-secondary me-2" onClick={handleYes}>
                                        Yes
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={handleNo}>
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show" />
                </>
            )}

        </>

    );


>>>>>>> feature/accountsetup
};

export default AccountSetup;