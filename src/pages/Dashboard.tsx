
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CalendarDays, Clock, WashingMachine, X } from "lucide-react";

// Simulated booking data
const mockBookings = [
  {
    id: 1,
    date: "2025-04-15",
    time: "09:00 - 10:00",
    service: "Regular Wash",
    status: "Upcoming",
    machine: "Machine 3"
  },
  {
    id: 2,
    date: "2025-04-17",
    time: "13:00 - 14:00",
    service: "Heavy Duty Wash",
    status: "Upcoming",
    machine: "Machine 1"
  },
  {
    id: 3,
    date: "2025-04-10",
    time: "11:00 - 12:00",
    service: "Delicate Wash",
    status: "Completed",
    machine: "Machine 2"
  },
  {
    id: 4,
    date: "2025-04-08",
    time: "15:00 - 16:00",
    service: "Express Wash",
    status: "Completed",
    machine: "Machine 4"
  }
];

const Dashboard = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState(mockBookings);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleCancelBooking = (id: number) => {
    // Simulate cancellation for demo purposes
    setBookings(bookings.map(booking => 
      booking.id === id ? {...booking, status: "Cancelled"} : booking
    ));
    
    toast({
      title: "Booking cancelled",
      description: "Your booking has been successfully cancelled.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} onLogin={handleLogin} />
      
      <div className="flex-1 container py-8">
        <h1 className="text-3xl font-bold text-laundry-700 mb-6">My Dashboard</h1>
        
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
                          <CardDescription>Booking #{booking.id}</CardDescription>
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
                          <span>{booking.date}</span>
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
                  </Card>
                )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
