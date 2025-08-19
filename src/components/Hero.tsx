
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-background via-secondary/30 to-accent/10">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                🎉 Say goodbye to laundry day stress!
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Never Wait for a 
              <span className="block bg-gradient-to-r from-primary via-accent to-vibrant-green bg-clip-text text-transparent animate-pulse">
                Washing Machine
              </span>
              Again! 🚀
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Tired of carrying heavy baskets only to find all machines occupied? We get it! 
              Book your perfect time slot in seconds and waltz in knowing your machine is ready and waiting. ✨
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate("/booking")} 
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                <Calendar className="mr-2 h-5 w-5" /> 
                Book My Slot Now!
              </Button>
              <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5 hover:border-primary/40">
                See How It Works <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">200+ happy students</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Zero waiting time</span>
              </div>
            </div>
          </div>
          <div className="relative lg:ml-auto">
            <div className="relative mx-auto aspect-video overflow-hidden rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3000&q=80"
                alt="Laundry machines"
                width={550}
                height={310}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 h-24 w-24 md:h-32 md:w-32 rounded-lg bg-laundry-500/20 backdrop-blur" />
            <div className="absolute -top-4 -right-4 h-24 w-24 md:h-32 md:w-32 rounded-lg bg-laundry-500/20 backdrop-blur" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
