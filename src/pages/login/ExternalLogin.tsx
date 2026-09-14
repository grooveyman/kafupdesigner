

const ExternalLogin: React.FC = () => {
    return (
        <>
            <div className="">
                <p className="text-center mt-3">or</p>
                <button className="btn btn-google w-full h-full p-3 mt-3" type="button">
                    <span className="google-logo" aria-hidden="true">
                        <svg viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                            <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.3H272.1v95.2h146.9c-6.3 33.7-25 62.3-53.2 81.5v67.6h85.9c50.2-46.3 79.8-114.2 79.8-193.9z" />
                            <path fill="#34A853" d="M272.1 544.3c72.6 0 133.6-24.1 178.3-65.4l-85.9-67.6c-23.8 16-54.3 25.4-92.3 25.4-70.9 0-131-47.9-152.3-112.3H30.4v70.6c44.5 88.3 136.6 149.3 241.7 149.3z" />
                            <path fill="#FBBC05" d="M119.8 322.4c-10.4-30.6-10.4-63.4 0-94l-70.6-70.6C14.9 190.4 0 234.6 0 279.5c0 44.9 14.9 89.1 49.2 121.7l70.6-70.6z" />
                            <path fill="#EA4335" d="M272.1 107.8c39.6 0 75.2 13.6 103.3 40.4l77.4-77.4C407.5 24.4 342.6 0 272.1 0 167 0 74.9 60.9 30.4 149.2l70.6 70.6c21.3-64.4 81.4-112.3 152.3-112.3z" />
                        </svg>
                    </span>
                    Continue with Google
                </button>
            </div>
        </>
    );
}

export default ExternalLogin;