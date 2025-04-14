
import { Calendar, CheckCircle, Clock, SmartphoneCharging } from "lucide-react";

const steps = [
  {
    title: "Book Your Slot",
    description: "Select your preferred date and time slot through our easy-to-use booking system.",
    icon: Calendar,
  },
  {
    title: "Receive Confirmation",
    description: "Get instant confirmation and reminders about your upcoming laundry session.",
    icon: SmartphoneCharging,
  },
  {
    title: "Do Your Laundry",
    description: "Show up at your designated time and complete your laundry without waiting.",
    icon: Clock,
  },
  {
    title: "Finish & Feedback",
    description: "Collect your clean laundry and rate your experience to help us improve.",
    icon: CheckCircle,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-laundry-50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter">How It Works</h2>
          <p className="mt-4 text-lg text-gray-500">
            Our simple 4-step process makes laundry management effortless
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-laundry-100 mb-6">
                <step.icon className="h-6 w-6 text-laundry-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-500">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:flex items-center justify-center w-full mt-6">
                  <div className="h-0.5 w-full bg-laundry-100 relative">
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full">
                      <svg className="h-4 w-4 text-laundry-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
