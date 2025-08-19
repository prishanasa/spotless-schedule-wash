
import { Calendar, CheckCircle, Clock, SmartphoneCharging } from "lucide-react";

const steps = [
  {
    title: "Book Your Perfect Time",
    description: "Pick any time that works for you! Our calendar shows real-time availability - no more guessing games! 📅",
    icon: Calendar,
    emoji: "📅",
    color: "from-blue-500 to-purple-500",
  },
  {
    title: "Get Instant Confirmation",
    description: "Boom! You'll get a confirmation message faster than you can say 'clean clothes' - plus helpful reminders! 📱",
    icon: SmartphoneCharging,
    emoji: "📱",
    color: "from-green-500 to-teal-500",
  },
  {
    title: "Walk In & Start Washing",
    description: "Stroll in at your time and your machine will be waiting for you - like magic, but better! ✨",
    icon: Clock,
    emoji: "✨",
    color: "from-orange-500 to-pink-500",
  },
  {
    title: "Enjoy Fresh Results",
    description: "Grab your perfectly clean clothes and maybe leave us a review? We love hearing from happy customers! 🌟",
    icon: CheckCircle,
    emoji: "🌟",
    color: "from-purple-500 to-indigo-500",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              ⚡ Super Simple Process
            </span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            It's As Easy As <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">1-2-3-4!</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Seriously, we've made it so simple that your grandma could do it (and she probably already has)! 
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
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
                <div className="hidden lg:block absolute top-10 -right-4 xl:-right-8">
                  <svg className="h-8 w-8 text-primary/30" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground text-lg">
            Still have questions? We're here to help! Just give us a shout 💬
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
