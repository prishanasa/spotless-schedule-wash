
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShirtIcon, Shirt, Umbrella, Clock } from "lucide-react";

const services = [
  {
    title: "Regular Wash",
    description: "Standard washing program suitable for everyday clothes",
    icon: ShirtIcon,
    price: "$5",
  },
  {
    title: "Heavy Duty Wash",
    description: "Intensive program for heavily soiled items like work clothes and bedding",
    icon: Umbrella,
    price: "$8",
  },
  {
    title: "Delicate Wash",
    description: "Gentle program for delicate fabrics like silk and wool",
    icon: Shirt,
    price: "$7",
  },
  {
    title: "Express Wash",
    description: "Quick wash program for lightly soiled clothes when you're in a hurry",
    icon: Clock,
    price: "$10",
  },
];

const ServicesList = () => {
  return (
    <section className="py-16 container px-4 md:px-6" id="services">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tighter">Our Services</h2>
        <p className="mt-4 text-lg text-gray-500">
          Choose from our range of professional laundry services
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <Card key={index} className="transition-all hover:shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <service.icon className="h-6 w-6 text-laundry-500" />
                <span className="font-semibold text-laundry-500">{service.price}</span>
              </div>
              <CardTitle className="mt-4">{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ServicesList;
