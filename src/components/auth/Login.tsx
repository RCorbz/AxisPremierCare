import { useState, useEffect } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function Login() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize Recaptcha
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': () => {
                    // reCAPTCHA solved
                }
            });
        }
    }, []);

    const handleSendCode = async () => {
        setError("");
        setLoading(true);
        try {
            const appVerifier = window.recaptchaVerifier;
            // Format number to E.164 if needed (assuming US for now)
            const formattedNumber = phoneNumber.startsWith("+") ? phoneNumber : `+1${phoneNumber}`;
            const confirmation = await signInWithPhoneNumber(auth, formattedNumber, appVerifier);
            setConfirmationResult(confirmation);
        } catch (err: any) {
            console.error(err);
            setError("Failed to send code. Ensure number format is +1XXXXXXXXXX");
        }
        setLoading(false);
    };

    const handleVerifyCode = async () => {
        setError("");
        setLoading(true);
        if (!confirmationResult) return;

        try {
            await confirmationResult.confirm(verificationCode);
            navigate("/portal");
        } catch (err: any) {
            console.error(err);
            setError("Invalid code.");
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background-dark px-4">
            <div className="w-full max-w-md space-y-8 rounded-xl border border-surface-border bg-surface-dark p-10 shadow-2xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold uppercase tracking-tighter text-white">Member Access</h2>
                    <p className="mt-2 text-text-muted">Enter your secure terminal.</p>
                </div>

                {error && <div className="rounded bg-red-900/20 p-3 text-sm text-red-500 border border-red-900/50">{error}</div>}

                {!confirmationResult ? (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase text-text-muted">Phone Number</label>
                            <input
                                type="tel"
                                placeholder="555-555-5555"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="mt-2 w-full border-b-2 border-surface-border bg-transparent py-3 text-xl text-white outline-none focus:border-primary placeholder:text-surface-border/50"
                            />
                        </div>
                        <div id="recaptcha-container"></div>
                        <button
                            onClick={handleSendCode}
                            disabled={loading || !phoneNumber}
                            className="w-full rounded-sm bg-primary py-4 font-bold text-black uppercase tracking-wider hover:bg-white disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Request Code"}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase text-text-muted">Security Code</label>
                            <input
                                type="text"
                                placeholder="123456"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                className="mt-2 w-full border-b-2 border-surface-border bg-transparent py-3 text-3xl text-center text-white outline-none focus:border-primary tracking-[1em]"
                            />
                        </div>
                        <button
                            onClick={handleVerifyCode}
                            disabled={loading || !verificationCode}
                            className="w-full rounded-sm bg-primary py-4 font-bold text-black uppercase tracking-wider hover:bg-white disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Authenticate"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Add types for window
declare global {
    interface Window {
        recaptchaVerifier: any;
    }
}
