
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServicesList from "@/components/ServicesList";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Index = () => {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Simulate login for demo purposes
    setIsLoggedIn(true);
    toast({
      title: "Logged in successfully",
      description: "Welcome back to WashWise!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={isLoggedIn} onLogin={handleLogin} />
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
