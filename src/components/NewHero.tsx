import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Calendar } from "lucide-react";

const NewHero = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-background via-secondary/30 to-accent/10">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                🏠 Hostel Life Made Easy
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Hostel LaundryLink: 
              <span className="block bg-gradient-to-r from-primary via-accent to-vibrant-green bg-clip-text text-transparent">
                Never Wait for Your Laundry Again
              </span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Check machine status, book your slot, and get notified when your laundry is done. 
              Smart laundry management designed specifically for hostel students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate("/#live-status")} 
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                <Sparkles className="mr-2 h-5 w-5" /> 
                Check Live Status
              </Button>
              <Button 
                onClick={() => navigate("/auth")} 
                variant="outline" 
                size="lg" 
                className="border-primary/20 hover:bg-primary/5 hover:border-primary/40"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Student Login
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">12 machines available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Real-time updates</span>
              </div>
            </div>
          </div>
          <div className="relative lg:ml-auto">
            <div className="relative mx-auto aspect-video overflow-hidden rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3000&q=80"
                alt="Modern laundry room with washing machines and dryers"
                width={550}
                height={310}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 h-24 w-24 md:h-32 md:w-32 rounded-lg bg-primary/20 backdrop-blur" />
            <div className="absolute -top-4 -right-4 h-24 w-24 md:h-32 md:w-32 rounded-lg bg-accent/20 backdrop-blur" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewHero;