
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShirtIcon, Shirt, Umbrella, Clock } from "lucide-react";

const services = [
  {
    title: "Regular Wash",
    description: "Perfect for your everyday clothes - t-shirts, jeans, and casual wear. Your go-to choice! 👕",
    icon: ShirtIcon,
    price: "$5",
    emoji: "👕",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Heavy Duty Wash",
    description: "Got muddy sports gear or work clothes? This powerhouse cycle tackles the toughest stains! 💪",
    icon: Umbrella,
    price: "$8",
    emoji: "💪",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Delicate Wash",
    description: "Treat your favorite silk blouse and wool sweaters like royalty with our gentle touch 🌸",
    icon: Shirt,
    price: "$7",
    emoji: "🌸",
    color: "from-pink-500 to-purple-500",
  },
  {
    title: "Express Wash",
    description: "Running late? This speedy cycle gets you fresh clothes in no time - perfect for busy lives! ⚡",
    icon: Clock,
    price: "$10",
    emoji: "⚡",
    color: "from-green-500 to-teal-500",
  },
];

const ServicesList = () => {
  return (
    <section className="py-20 container px-4 md:px-6" id="services">
      <div className="text-center mb-16">
        <div className="inline-block mb-4">
          <span className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
            🧺 Choose Your Perfect Wash
          </span>
        </div>
        <h2 className="text-4xl font-bold tracking-tight mb-4">
          Laundry Made <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Just Right</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Different clothes need different care. Pick the perfect wash cycle for your fabrics and lifestyle! 
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <Card key={index} className="group relative overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
            <CardHeader className="pb-4 relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${service.color} text-white shadow-lg`}>
                  <service.icon className="h-6 w-6" />
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary">{service.price}</span>
                  <div className="text-xs text-muted-foreground">per load</div>
                </div>
              </div>
              <CardTitle className="text-xl flex items-center gap-2">
                {service.title}
                <span className="text-lg">{service.emoji}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-12">
        <p className="text-muted-foreground">
          Can't decide? Our friendly staff can help you choose! Just ask 😊
        </p>
      </div>
    </section>
  );
};

export default ServicesList;
