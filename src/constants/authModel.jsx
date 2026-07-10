import { useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from 'sonner';
import { Phone, Mail, ArrowLeft } from "lucide-react";

const AuthModal = ({ isOpen, onClose }) => {
  const [authMethod, setAuthMethod] = useState("email"); // 'email' | 'phone'
  const [isLogin, setIsLogin] = useState(true); // For email mode
  
  // Email states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Phone states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setEmail(user.email || user.phoneNumber);
      toast.success(`Welcome back!`);
    }
  }, []);

  const resetState = () => {
    setEmail("");
    setPassword("");
    setPhoneNumber("");
    setOtp("");
    setShowOtpInput(false);
    setConfirmationResult(null);
    setAuthMethod("email");
    setLoading(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // ---------------- EMAIL / PASSWORD AUTH ----------------
  const handleEmailAuth = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        localStorage.setItem("user", JSON.stringify({ email: user.email, uid: user.uid }));
        toast.success("Logged in successfully!");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        localStorage.setItem("user", JSON.stringify({ email: user.email, uid: user.uid }));
        await setDoc(doc(db, "Users", user.uid), { email: user.email });
        toast.success("Account created successfully!");
      }
      handleClose();
      window.location.reload();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- GOOGLE AUTH ----------------
  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      localStorage.setItem("user", JSON.stringify({ email: user.email, uid: user.uid }));
      await setDoc(doc(db, "Users", user.uid), { email: user.email }, { merge: true });
      toast.success("Logged in with Google successfully!");
      handleClose();
      window.location.reload();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- PHONE AUTH ----------------
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': (response) => {
            // reCAPTCHA solved
          }
        });
      } catch (error) {
        console.error("Error setting up recaptcha", error);
      }
    }
  };

  const handleSendOtpWithCode = async (fullNumber) => {
    if (!phoneNumber || phoneNumber.length < 5) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, fullNumber, appVerifier);
      setConfirmationResult(confirmation);
      setShowOtpInput(true);
      toast.success(`OTP sent to ${fullNumber}!`);
    } catch (error) {
      console.error("OTP Error:", error);
      
      // If recaptcha is already rendered or in a bad state, we need to reset the UI
      if (error.message && error.message.includes("reCAPTCHA has already been rendered")) {
         toast.error("Please refresh the page and try again.");
      } else if (error.code === 'auth/invalid-phone-number') {
        toast.error("Invalid phone number format. Please check the number.");
      } else if (error.code === 'auth/too-many-requests') {
        toast.error("Too many requests. Please try again later.");
      } else {
        toast.error(error.message || "Failed to send OTP.");
      }
      
      // Do NOT clear recaptchaVerifier here, as it breaks the DOM node for future attempts
      // window.recaptchaVerifier.clear() has a bug in some Firebase versions
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }
    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      localStorage.setItem("user", JSON.stringify({ email: user.phoneNumber, uid: user.uid }));
      await setDoc(doc(db, "Users", user.uid), { email: user.phoneNumber, phone: user.phoneNumber }, { merge: true });
      toast.success("Phone verified and logged in successfully!");
      handleClose();
      window.location.reload();
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[100]">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[400px] relative max-w-[90vw]">
        
        {/* Recaptcha Container (Invisible) */}
        <div id="recaptcha-container"></div>

        {/* Back Button for Phone Mode */}
        {authMethod === "phone" && (
          <button 
            onClick={() => { setAuthMethod("email"); setShowOtpInput(false); }} 
            className="absolute top-6 left-6 text-gray-400 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        
        <button onClick={handleClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors">
          ✖
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
          {authMethod === "phone" 
            ? (showOtpInput ? "Enter OTP" : "Sign in with Phone")
            : (isLogin ? "Welcome Back" : "Create Account")}
        </h2>

        {/* --------- EMAIL MODE --------- */}
        {authMethod === "email" && (
          <>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg mb-4 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-slate-800 outline-none transition-all text-gray-900"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg mb-6 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-slate-800 outline-none transition-all text-gray-900"
            />

            <button
              onClick={handleEmailAuth}
              className="w-full bg-slate-800 text-white py-3 rounded-lg hover:bg-slate-700 font-semibold mb-4 transition-colors shadow-md disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
            </button>

            <p
              className="text-center text-slate-600 mt-2 mb-6 cursor-pointer text-sm hover:text-slate-900 font-medium"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </p>

            <div className="flex items-center justify-center mb-6">
              <div className="border-t border-gray-200 flex-grow"></div>
              <span className="px-4 text-gray-400 text-sm font-medium">OR CONTINUE WITH</span>
              <div className="border-t border-gray-200 flex-grow"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleGoogleSignIn}
                className="w-full bg-white border border-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 font-medium transition-colors shadow-sm disabled:opacity-50"
                disabled={loading}
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                Google
              </button>
              
              <button
                onClick={() => setAuthMethod("phone")}
                className="w-full bg-white border border-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 font-medium transition-colors shadow-sm disabled:opacity-50"
                disabled={loading}
              >
                <Phone size={18} className="text-gray-600"/>
                Phone
              </button>
            </div>
          </>
        )}

        {/* --------- PHONE MODE --------- */}
        {authMethod === "phone" && (
          <>
            {!showOtpInput ? (
              <>
                <p className="text-sm text-gray-500 mb-4 text-center">We will send you a one-time password to this mobile number.</p>
                <div className="flex gap-2 mb-6">
                  <select 
                    className="p-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-slate-800 outline-none transition-all text-gray-900 w-24"
                    defaultValue="+91"
                    id="countryCode"
                  >
                    <option value="+1">US (+1)</option>
                    <option value="+44">UK (+44)</option>
                    <option value="+91">IN (+91)</option>
                    <option value="+61">AU (+61)</option>
                    <option value="+81">JP (+81)</option>
                    <option value="+49">DE (+49)</option>
                    <option value="+33">FR (+33)</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g,''))}
                    className="flex-grow p-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-slate-800 outline-none transition-all text-gray-900"
                  />
                </div>
                <button
                  onClick={() => {
                    const code = document.getElementById('countryCode').value;
                    const fullNumber = code + phoneNumber.trim();
                    // Override the old formatted phone logic with the explicit country code
                    handleSendOtpWithCode(fullNumber);
                  }}
                  className="w-full bg-slate-800 text-white py-3 rounded-lg hover:bg-slate-700 font-semibold mb-4 transition-colors shadow-md disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4 text-center">Enter the code sent to {phoneNumber}</p>
                <input
                  type="text"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 text-center tracking-[0.5em] font-bold text-xl border border-gray-200 rounded-lg mb-6 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-slate-800 outline-none transition-all text-gray-900"
                  maxLength={6}
                />
                <button
                  onClick={handleVerifyOtp}
                  className="w-full bg-slate-800 text-white py-3 rounded-lg hover:bg-slate-700 font-semibold mb-4 transition-colors shadow-md disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>
              </>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default AuthModal;
