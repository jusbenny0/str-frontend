import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import OAuth from '../components/Auth/OAuth';
import GoBackArrow from '../components/Auth/GoBackArrow';
import ShowPass from '../components/Auth/ShowPass';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [arePassEqual, setArePassEqual] = useState(false);
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate();

  const [passwordStrength, setPasswordStrength] = useState(0);

  const confirmPasswordRef = useRef();
  const passwordRef = useRef();

  const handleChange = (e) => {
    const updatedFormData = { ...formData, [e.target.id]: e.target.value };
    setFormData(updatedFormData);
    if (e.target.id === "password" || e.target.id === "confirmPassword") {

      if (passwordRef.current.value === confirmPasswordRef.current.value) {
        console.log(passwordRef.current.value);
        console.log(confirmPasswordRef.current.value);

        const strength = calculatePasswordStrength(e.target.value);
        setPasswordStrength(strength);
        setArePassEqual(true)

      } else {
        setArePassEqual(false)
      }
    }


  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;

    const lengthReq = password.length >= 8;
    const numberReq = /\d/.test(password);
    const specialReq = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const capitalReq = /[A-Z]/.test(password);

    if (lengthReq) strength++;
    if (numberReq) strength++;
    if (specialReq) strength++;
    if (capitalReq) strength++;

    return strength;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordStrength < 4) {
      setError("Your password is not strong enough.");
      toast.error("Your password is not strong enough.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError(false);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Signup response data:", data);

      setLoading(false);

      if (data.success === false) {
        setError(data.message || "Something went wrong. Please try again.");
        toast.error(data.message || "Something went wrong. Please try again.");
        return;
      }


      localStorage.setItem('userID', data.userID);
      localStorage.setItem('email', data.email);

      navigate('/getinfo');

    } catch (error) {
      setLoading(false);
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    }
  };

  const getStrengthLabelAndColor = (strength) => {
    switch (strength) {
      case 1:
        return { label: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
      case 2:
        return { label: 'Poor', color: 'bg-orange-500', width: 'w-2/4' };
      case 3:
        return { label: 'Mid', color: 'bg-yellow-500', width: 'w-3/4' };
      case 4:
        return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
      default:
        return { label: '', color: 'bg-gray-300', width: 'w-0' };
    }
  };

  const { label: strengthLabel, color: strengthColor, width: strengthWidth } = getStrengthLabelAndColor(passwordStrength);

  const inputClassUserEmail = "w-full p-2 placeholder:opacity-60  rounded-lg focus:outline-none bg-gray-300 placeholder:text-black focus:bg-opacity-60 bg-opacity-25 transition-colors duration-300"
  const passwordClass = "w-full rounded-lg placeholder:opacity-60 bg-gray-300 placeholder:text-black text-black p-2 focus:outline-none focus:bg-opacity-60 bg-opacity-25 transition-colors duration-300"




  return (
    <div className="">
      <div className="w-screen h-screen flex flex-col justify-center items-center bg-gradient-to-bl from-pink-400 to-pink-100">
        <h2 className="text-3xl font-bold mb-6 gradient-text h-[40px]">Sign Up</h2>
        <form
          className="sm:w-full w-[80%] max-w-sm bg-black bg-opacity-60 p-6 rounded-lg shadow-md flex flex-col space-y-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="username"
              className="block text-white font-medium mb-1">
              Uživatelské jméno
            </label>
            <div className="border-gradient">
              <input
                className={`${inputClassUserEmail}`}
                type="text"
                id="username"
                name="username"
                placeholder="skibidisigma42069"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-white font-medium mb-1">
              Email
            </label>
            <div className="border-gradient">
              <input
                className={`${inputClassUserEmail}`}
                type="email"
                id="email"
                name="email"
                placeholder="skibidi69@sigma.ohio"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-white font-medium mb-1">
              Heslo
            </label>
            <div className="relative w-full mt-1">
              <input
                ref={passwordRef}
                type={showPass ? "text" : "password"}
                name="password"
                id="password"
                className={`${passwordClass}`}
                placeholder="Psst"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-white font-medium mb-1">
              Potvrď heslo
            </label>
            <div className="w-full mt-1">
              <input
                ref={confirmPasswordRef}
                type={showPass ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                className={`${passwordClass}`}
                placeholder="Psst"
                required
                onChange={handleChange}
              />
            </div>
          </div>
          <ShowPass yourState={showPass} setYourState={setShowPass} />

          <div className="flex gap-2">
            <button
              type="submit"
              className={`w-full py-3 text-white rounded-md transition-colors mesh-gradient ${passwordStrength < 4 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading || passwordStrength < 4}
            >
              {loading ? 'Načítám...' : 'Registrovat se'}
            </button>
            <OAuth />
          </div>

          {/* indikatory jestli je heslo sigma nebo ne */}
          <div className="mt-4">
            <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
              <div className={`${strengthColor} h-full ${strengthWidth} transition-all duration-300`} />
            </div>
            {strengthLabel && (
              <p className="text-white mt-1 text-sm font-semibold">{strengthLabel}</p>
            )}
            <ul className="text-white text-sm mt-2 space-y-1">
              <li className={formData.password && formData.password.length >= 8 ? 'text-green-400' : 'text-red-400'}>• At least 8 characters</li>
              <li className={formData.password && /\d/.test(formData.password) ? 'text-green-400' : 'text-red-400'}>• At least one number</li>
              <li className={formData.password && /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-400' : 'text-red-400'}>• At least one special character</li>
              <li className={formData.password && /[A-Z]/.test(formData.password) ? 'text-green-400' : 'text-red-400'}>• At least one capital letter</li>
              <li className={arePassEqual ? 'text-green-400' : 'text-red-400'}>• Shoda hesel</li>
            </ul>
          </div>
        </form>

        <h3 className="mt-4 text-white flex gap-1">
          <p>Already Have an Account?{' '}</p>
          <Link
            to="/login"
            className="text-[#ff46f3] hover:font-bold transition-all hover:text-[#ba2ae6] text-center w-[70px]"
          >
            Přihlásit
          </Link>
        </h3>
      </div>
      <GoBackArrow componentColor={"white"} />
    </div>
  );
}
