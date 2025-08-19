import { Calendar, Bell, Package } from "lucide-react";

const steps = [
  {
    title: "Book Your Slot",
    description: "Choose your preferred time and machine through our easy booking system",
    icon: Calendar,
    emoji: "📅",
    color: "from-blue-500 to-purple-500",
  },
  {
    title: "Drop Off Your Laundry",
    description: "Arrive at your scheduled time and start your wash cycle",
    icon: Package,
    emoji: "👕",
    color: "from-green-500 to-teal-500",
  },
  {
    title: "Get Notified & Pick Up",
    description: "Receive notifications when your laundry is ready for pickup",
    icon: Bell,
    emoji: "🔔",
    color: "from-orange-500 to-pink-500",
  }
];

const NewHowItWorks = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              ⚡ Simple Process
            </span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            How It <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to hassle-free laundry management
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center relative">
              <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg mb-6 relative group`}>
                <div className="absolute -top-2 -right-2 text-2xl">{step.emoji}</div>
                <step.icon className="h-8 w-8" />
                <div className="absolute -bottom-1 -right-1 bg-white text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold border-2 border-background">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 -right-8">
                  <svg className="h-8 w-8 text-primary/30" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewHowItWorks;