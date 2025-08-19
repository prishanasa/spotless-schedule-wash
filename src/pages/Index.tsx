
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import NewHero from "@/components/NewHero";
import LiveMachineStatus from "@/components/LiveMachineStatus";
import NewHowItWorks from "@/components/NewHowItWorks";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogin = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={!!user} onLogin={handleLogin} />
      <main>
        <NewHero />
        <div id="live-status">
          <LiveMachineStatus />
        </div>
        <NewHowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
