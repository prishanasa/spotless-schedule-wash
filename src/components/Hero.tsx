
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-laundry-50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Smart Laundry Management Made <span className="text-laundry-500">Simple</span>
            </h1>
            <p className="text-gray-500 md:text-xl">
              Book your laundry slots with ease. Save time, avoid queues, and get real-time updates on your laundry status.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => navigate("/booking")} 
                className="bg-laundry-500 hover:bg-laundry-600"
                size="lg"
              >
                <Calendar className="mr-2 h-4 w-4" /> Book a Slot
              </Button>
              <Button variant="outline" size="lg">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
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
