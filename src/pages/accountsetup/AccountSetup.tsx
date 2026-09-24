

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
};

export default AccountSetup;