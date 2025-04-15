
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { format, parseISO } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CalendarIcon, FilterX, RefreshCw, Search, Users } from "lucide-react";

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [machines, setMachines] = useState<any[]>([]);
  const [userProfiles, setUserProfiles] = useState<any[]>([]);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Sorting
  const [sortField, setSortField] = useState("booking_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Admin check
  const checkIfAdmin = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the admin dashboard",
        variant: "destructive",
      });
      navigate("/auth");
      return false;
    }
    
    // Since we don't have a real admin role system yet, let's just check 
    // if the user is authorized to see this page
    // In a real system, you'd check for admin roles
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
      
    if (error || !data) {
      toast({
        title: "Access denied",
        description: "You don't have permission to access the admin dashboard",
        variant: "destructive",
      });
      navigate("/dashboard");
      return false;
    }
    
    return true;
  };

  // Fetch all the data we need
  useEffect(() => {
    const fetchData = async () => {
      const isAdmin = await checkIfAdmin();
      if (!isAdmin) return;
      
      setLoading(true);
      
      try {
        // Fetch all bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select("*, machines(name, type)")
          .order("booking_date", { ascending: false });
          
        if (bookingsError) throw bookingsError;
        
        // Fetch all users
        const { data: usersData, error: usersError } = await supabase
          .from("profiles")
          .select("*");
          
        if (usersError) throw usersError;
        
        // Fetch all machines
        const { data: machinesData, error: machinesError } = await supabase
          .from("machines")
          .select("*");
          
        if (machinesError) throw machinesError;
        
        // Extract unique service types
        const uniqueServiceTypes = [...new Set(bookingsData.map((booking: any) => booking.service_type))];
        
        setBookings(bookingsData);
        setFilteredBookings(bookingsData);
        setUserProfiles(usersData);
        setMachines(machinesData);
        setServiceTypes(uniqueServiceTypes);
      } catch (error: any) {
        toast({
          title: "Error fetching data",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, navigate, toast]);
  
  // Apply filters
  useEffect(() => {
    let result = [...bookings];
    
    // Apply search filter across user email, machine name, and booking ID
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(booking => {
        const user = userProfiles.find(u => u.id === booking.user_id);
        const userEmail = user?.email?.toLowerCase() || '';
        const machineName = booking.machines?.name?.toLowerCase() || '';
        const bookingId = booking.id?.toLowerCase() || '';
        
        return userEmail.includes(query) || 
               machineName.includes(query) || 
               bookingId.includes(query);
      });
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(booking => booking.status === statusFilter);
    }
    
    // Apply service filter
    if (serviceFilter !== 'all') {
      result = result.filter(booking => booking.service_type === serviceFilter);
    }
    
    // Apply date filter
    if (dateFilter) {
      const filterDate = format(dateFilter, 'yyyy-MM-dd');
      result = result.filter(booking => booking.booking_date === filterDate);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let valueA, valueB;
      
      // Handle different field types
      if (sortField === 'booking_date' || sortField === 'created_at') {
        valueA = new Date(a[sortField]).getTime();
        valueB = new Date(b[sortField]).getTime();
      } else {
        valueA = a[sortField];
        valueB = b[sortField];
      }
      
      // Compare based on sort direction
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    setFilteredBookings(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [bookings, searchQuery, statusFilter, serviceFilter, dateFilter, sortField, sortDirection, userProfiles]);
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  
  // Get user email by ID
  const getUserEmail = (userId: string) => {
    const user = userProfiles.find(u => u.id === userId);
    return user?.email || 'Unknown';
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setServiceFilter("all");
    setDateFilter(undefined);
    setSortField("booking_date");
    setSortDirection("desc");
  };
  
  // Toggle sort direction
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar isLoggedIn={!!user} onLogin={() => navigate("/auth")} />
      
      <div className="flex-1 container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-laundry-700">Admin Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-laundry-500" />
            <span className="text-sm text-muted-foreground">
              Total Users: {userProfiles.length}
            </span>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-laundry-500" />
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="mb-8 space-y-4 bg-background/60 p-4 rounded-lg border">
              <h2 className="text-xl font-semibold">Filters</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Email, machine, booking ID..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Status filter */}
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Upcoming">Upcoming</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Service type filter */}
                <div>
                  <Label htmlFor="service">Service Type</Label>
                  <Select value={serviceFilter} onValueChange={setServiceFilter}>
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      {serviceTypes.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Date filter */}
                <div>
                  <Label htmlFor="date">Booking Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        id="date"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFilter ? (
                          format(dateFilter, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateFilter}
                        onSelect={setDateFilter}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                  className="flex items-center gap-1"
                >
                  <FilterX className="h-4 w-4" />
                  Reset Filters
                </Button>
              </div>
            </div>
            
            {/* Bookings Table */}
            <div className="rounded-md border">
              <Table>
                <TableCaption>
                  Showing {currentItems.length} of {filteredBookings.length} bookings
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('booking_date')}>
                      Date {sortField === 'booking_date' && (
                        sortDirection === 'asc' ? '↑' : '↓'
                      )}
                    </TableHead>
                    <TableHead>User</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('service_type')}
                    >
                      Service {sortField === 'service_type' && (
                        sortDirection === 'asc' ? '↑' : '↓'
                      )}
                    </TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Machine</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      Status {sortField === 'status' && (
                        sortDirection === 'asc' ? '↑' : '↓'
                      )}
                    </TableHead>
                    <TableHead 
                      className="text-right cursor-pointer"
                      onClick={() => handleSort('created_at')}
                    >
                      Created {sortField === 'created_at' && (
                        sortDirection === 'asc' ? '↑' : '↓'
                      )}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-24">
                        No bookings found matching the filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          {format(parseISO(booking.booking_date), "PPP")}
                        </TableCell>
                        <TableCell>
                          {getUserEmail(booking.user_id)}
                        </TableCell>
                        <TableCell>{booking.service_type}</TableCell>
                        <TableCell>{booking.time_slot}</TableCell>
                        <TableCell>{booking.machines?.name || booking.machine_id}</TableCell>
                        <TableCell>
                          <Badge 
                            className={`
                              ${booking.status === "Upcoming" ? "bg-laundry-500" : ""}
                              ${booking.status === "Completed" ? "bg-green-500" : ""}
                              ${booking.status === "Cancelled" ? "bg-red-500" : ""}
                            `}
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {format(new Date(booking.created_at), "Pp")}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber = i + 1;
                    // Show pages around current page
                    const showPages = currentPage <= 3 
                      ? pageNumber 
                      : pageNumber + currentPage - 3;
                      
                    return showPages <= totalPages ? (
                      <PaginationItem key={showPages}>
                        <PaginationLink 
                          isActive={currentPage === showPages}
                          onClick={() => setCurrentPage(showPages)}
                        >
                          {showPages}
                        </PaginationLink>
                      </PaginationItem>
                    ) : null;
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationLink className="cursor-default">...</PaginationLink>
                    </PaginationItem>
                  )}
                  
                  {totalPages > 5 && currentPage < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationLink 
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin;
