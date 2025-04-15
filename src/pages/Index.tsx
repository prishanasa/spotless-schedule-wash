
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServicesList from "@/components/ServicesList";
import HowItWorks from "@/components/HowItWorks";
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
        <Hero />
        <ServicesList />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
