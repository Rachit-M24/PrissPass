import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slice/AuthSlice/AuthSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    masterPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        registerUser({
          Username: user.username,
          email: user.email,
          masterPassword: user.masterPassword,
        })
      ).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      <Card className="w-full max-w-md relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
        <CardHeader className="pb-2 relative z-10">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent tracking-tight">
            Create Your Account
          </CardTitle>
          <p className="text-center text-sm text-white/70 mt-1">
            Join us today with a few simple steps
          </p>
        </CardHeader>
        <CardContent className="p-6 relative z-10">
          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <Alert
                variant="destructive"
                className="animate-in fade-in bg-red-500/10 backdrop-blur-sm border-red-400/30 text-red-200"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-white/90">
                Username
              </Label>
              <Input
                type="text"
                name="username"
                id="username"
                required
                value={user.username}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 hover:bg-white/15"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-white/90">
                Email
              </Label>
              <Input
                type="email"
                name="email"
                id="email"
                required
                value={user.email}
                onChange={handleChange}
                placeholder="skibiddi@example.com"
                className="w-full rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 hover:bg-white/15"
              />
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="masterPassword" className="text-sm font-medium text-white/90">
                Password
              </Label>
              <Input
                type={showPassword ? "text" : "password"}
                name="masterPassword"
                id="masterPassword"
                required
                value={user.masterPassword}
                onChange={handleChange}
                placeholder="Create a strong one 💪"
                className="w-full rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 hover:bg-white/15"
              />
              <div
                className="absolute top-10 right-3 text-white/60 cursor-pointer hover:text-blue-300 transition-colors"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed backdrop-blur-sm border border-blue-400/20"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
            <p className="text-sm text-center text-white/70">
              Already have an account?{" "}
              <span
                className="text-blue-300 hover:text-blue-200 hover:underline cursor-pointer font-medium transition-colors"
                onClick={() => navigate("/")}
              >
                Log in
              </span>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;