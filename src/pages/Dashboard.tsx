
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CalendarDays, Clock, WashingMachine, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { format, parseISO } from "date-fns";

type Booking = {
  id: string;
  date: string;
  time: string;
  service: string;
  status: string;
  machine: string;
};

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (user === null) {
      toast({
        title: "Authentication required",
        description: "Please log in to view your dashboard",
      });
      navigate("/auth");
    }
  }, [user, navigate, toast]);

  // Fetch user's bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*, machines(name)")
          .eq("user_id", user.id)
          .order("booking_date", { ascending: false });

        if (error) throw error;

        const formattedBookings = data.map((booking: any) => ({
          id: booking.id,
          date: booking.booking_date,
          time: booking.time_slot,
          service: booking.service_type,
          status: booking.status,
          machine: booking.machines?.name || booking.machine_id,
        }));

        setBookings(formattedBookings);
      } catch (error: any) {
        toast({
          title: "Error fetching bookings",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, toast]);

  const handleCancelBooking = async (id: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "Cancelled" })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === id ? {...booking, status: "Cancelled"} : booking
      ));
      
      toast({
        title: "Booking cancelled",
        description: "Your booking has been successfully cancelled.",
      });
    } catch (error: any) {
      toast({
        title: "Error cancelling booking",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar isLoggedIn={!!user} onLogin={() => navigate("/auth")} />
      
      <div className="flex-1 container py-8">
        <h1 className="text-3xl font-bold text-laundry-700 mb-6">My Dashboard</h1>
        
        {loading ? (
          <Card>
            <CardHeader>
              <CardTitle>Loading...</CardTitle>
              <CardDescription>
                Fetching your booking information
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookings.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookings.filter(b => b.status === "Upcoming").length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookings.filter(b => b.status === "Completed").length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Cancelled</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookings.filter(b => b.status === "Cancelled").length}</div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
              
              {["upcoming", "completed", "cancelled"].map((tab) => (
                <TabsContent key={tab} value={tab} className="space-y-4">
                  {bookings
                    .filter(booking => booking.status.toLowerCase() === tab)
                    .map(booking => (
                      <Card key={booking.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{booking.service}</CardTitle>
                              <CardDescription>Booking #{booking.id.substring(0, 8)}</CardDescription>
                            </div>
                            <Badge 
                              className={`
                                ${booking.status === "Upcoming" ? "bg-laundry-500" : ""}
                                ${booking.status === "Completed" ? "bg-green-500" : ""}
                                ${booking.status === "Cancelled" ? "bg-red-500" : ""}
                              `}
                            >
                              {booking.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-muted-foreground" />
                              <span>{format(new Date(booking.date), "PPP")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{booking.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <WashingMachine className="h-4 w-4 text-muted-foreground" />
                              <span>{booking.machine}</span>
                            </div>
                          </div>
                        </CardContent>
                        {booking.status === "Upcoming" && (
                          <CardFooter>
                            <Button 
                              variant="destructive" 
                              className="w-full md:w-auto"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              <X className="h-4 w-4 mr-2" /> Cancel Booking
                            </Button>
                          </CardFooter>
                        )}
                      </Card>
                    ))}
                    
                    {bookings.filter(booking => booking.status.toLowerCase() === tab).length === 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>No {tab} bookings</CardTitle>
                          <CardDescription>
                            You don't have any {tab} bookings at the moment.
                          </CardDescription>
                        </CardHeader>
                        {tab === "upcoming" && (
                          <CardFooter>
                            <Button 
                              onClick={() => navigate("/booking")}
                              className="bg-laundry-500 hover:bg-laundry-600"
                            >
                              Book a Slot
                            </Button>
                          </CardFooter>
                        )}
                      </Card>
                    )}
                </TabsContent>
              ))}
            </Tabs>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
