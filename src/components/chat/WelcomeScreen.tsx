import {
  MessageCircle,
  Lightbulb,
  Code,
  FileText,
  HelpCircle,
  Calendar,
  Clock,
  Headphones,
  Shirt,
  UserCircle,
} from "lucide-react";

interface WelcomeScreenProps {
  onQuickAction: (query: string) => void;
}

const suggestions = [

  {
    icon: Calendar,
    title: "How to request time off",
    description: "timeoff requests",
    query: "How do I request time off?",
  },
  {
    icon: Clock,
    title: "The office hours",
    description: "the office hours",
    query: "What are the office hours?",
  },
  {
    icon: Headphones,
    title: "IT Support",
    description: "contact IT support",
    query: "How do I contact IT support?",
  },
  {
    icon: UserCircle,
    title: "Employee Portal",
    description: "employee portal access",
    query: "How do I access the employee portal?",
  },
];

export function WelcomeScreen({ onQuickAction }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How can I help you today?
          </h1>
        </div>

        {/* Suggestions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <button
                key={index}
                onClick={() => onQuickAction(suggestion.query)}
                className="group p-6 text-left bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {suggestion.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {suggestion.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Message */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by AI • Searching Company Knowledge Base
          </p>
        </div>
      </div>
    </div>
  );
}
