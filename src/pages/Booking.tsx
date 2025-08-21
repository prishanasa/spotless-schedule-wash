
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Tables } from "@/integrations/supabase/types";

type Service = Tables<"services">;
type Machine = Tables<"machines">;

type TimeSlot = {
  id: number;
  time: string;
};

// Simulated time slots data
const timeSlots: TimeSlot[] = [
  { id: 1, time: "08:00 - 09:00" },
  { id: 2, time: "09:00 - 10:00" },
  { id: 3, time: "10:00 - 11:00" },
  { id: 4, time: "11:00 - 12:00" },
  { id: 5, time: "13:00 - 14:00" },
  { id: 6, time: "14:00 - 15:00" },
  { id: 7, time: "15:00 - 16:00" },
  { id: 8, time: "16:00 - 17:00" },
];

const Booking = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedMachine, setSelectedMachine] = useState<string>("");
  const [services, setServices] = useState<Service[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Fetch services and machines from Supabase
  useEffect(() => {
    const fetchServicesAndMachines = async () => {
      try {
        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("*");
        
        if (servicesError) throw servicesError;
        setServices(servicesData || []);
        
        if (servicesData && servicesData.length > 0) {
          setSelectedService(servicesData[0].id.toString());
        }
        
        const { data: machinesData, error: machinesError } = await supabase
          .from("machines")
          .select("*");
        
        if (machinesError) throw machinesError;
        setMachines(machinesData || []);
        
        if (machinesData && machinesData.length > 0) {
          setSelectedMachine(machinesData[0].id);
        }
      } catch (error: any) {
        toast({
          title: "Error fetching data",
          description: error.message,
          variant: "destructive",
        });
      }
    };
    
    fetchServicesAndMachines();
  }, [toast]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (user === null) {
      toast({
        title: "Authentication required",
        description: "Please log in to book a laundry slot",
      });
      navigate("/auth");
    }
  }, [user, navigate, toast]);

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to book a laundry slot",
      });
      navigate("/auth");
      return;
    }
    
    if (!date || !selectedSlot || !selectedService || !selectedMachine) {
      toast({
        title: "Error",
        description: "Please select a date, time slot, service, and machine",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Get selected service name and cost
      const service = services.find(s => s.id.toString() === selectedService);
      const selectedSlotData = timeSlots.find(s => s.id === selectedSlot);
      const bookingCost = service?.cost || 0;

      // Get user email for booking record
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', user.id)
        .single();

      const userEmail = profile?.email || user.email || 'No email';
      
      // Insert booking data into Supabase
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          user_email: userEmail,
          service_type: service?.name || "",
          booking_date: format(date, "yyyy-MM-dd"),
          time_slot: selectedSlotData?.time || "",
          machine_id: selectedMachine,
          status: "Upcoming",
          cost: bookingCost
        })
        .select();

      if (error) throw error;
      
      if (error) throw error;
      
      toast({
        title: "Booking successful!",
        description: `You have booked ${service?.name} on ${format(date, "PPP")} at ${selectedSlotData?.time}`,
      });
      
      // Redirect to dashboard after successful booking
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error creating booking",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar isLoggedIn={!!user} onLogin={() => navigate("/auth")} />
      
      <div className="flex-1 container py-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Book a Laundry Slot</h1>
        
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
                disabled={(date) => date < new Date()}
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
                <CardTitle>Select Machine</CardTitle>
                <CardDescription>Choose a machine for your laundry</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedMachine} onValueChange={setSelectedMachine}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a machine" />
                  </SelectTrigger>
                  <SelectContent>
                    {machines.map(machine => (
                      <SelectItem key={machine.id} value={machine.id}>
                        {machine.name} ({machine.type})
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
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Book Now"}
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
