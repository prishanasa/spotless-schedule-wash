
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { format } from "date-fns";

// Simulated backend data
const timeSlots = [
  { id: 1, time: "08:00 - 09:00" },
  { id: 2, time: "09:00 - 10:00" },
  { id: 3, time: "10:00 - 11:00" },
  { id: 4, time: "11:00 - 12:00" },
  { id: 5, time: "13:00 - 14:00" },
  { id: 6, time: "14:00 - 15:00" },
  { id: 7, time: "15:00 - 16:00" },
  { id: 8, time: "16:00 - 17:00" },
];

const services = [
  { id: 1, name: "Regular Wash", price: 5 },
  { id: 2, name: "Heavy Duty Wash", price: 8 },
  { id: 3, name: "Delicate Wash", price: 7 },
  { id: 4, name: "Express Wash", price: 10 },
];

const Booking = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<string>("1");
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleBooking = () => {
    if (!date || !selectedSlot) {
      toast({
        title: "Error",
        description: "Please select a date and time slot",
        variant: "destructive",
      });
      return;
    }

    // Simulate booking submission
    const selectedServiceData = services.find(s => s.id.toString() === selectedService);
    const selectedSlotData = timeSlots.find(s => s.id === selectedSlot);
    
    toast({
      title: "Booking successful!",
      description: `You have booked ${selectedServiceData?.name} on ${format(date, "PPP")} at ${selectedSlotData?.time}`,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} onLogin={handleLogin} />
      
      <div className="flex-1 container py-8">
        <h1 className="text-3xl font-bold text-laundry-700 mb-6">Book a Laundry Slot</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
              <CardDescription>Choose your preferred date for laundry</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="border rounded-md"
              />
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Service</CardTitle>
                <CardDescription>Choose the type of wash service you need</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(service => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.name} (${service.price})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Available Time Slots</CardTitle>
                <CardDescription>Pick a convenient time slot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map(slot => (
                    <Button
                      key={slot.id}
                      variant={selectedSlot === slot.id ? "default" : "outline"}
                      className={selectedSlot === slot.id ? "bg-laundry-500 text-white" : ""}
                      onClick={() => setSelectedSlot(slot.id)}
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleBooking} 
                  className="w-full bg-laundry-500 hover:bg-laundry-600"
                >
                  Book Now
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Booking;
