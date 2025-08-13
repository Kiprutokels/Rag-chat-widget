import { MessageCircle, FileText, Calendar, Clock, Headphones, Shirt, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface WelcomeScreenProps {
  onQuickAction: (query: string) => void;
}

const quickActions = [
  {
    icon: FileText,
    label: 'Company Policies',
    query: 'What are our company policies?'
  },
  {
    icon: Calendar,
    label: 'Time Off Request',
    query: 'How do I request time off?'
  },
  {
    icon: Clock,
    label: 'Office Hours',
    query: 'What are the office hours?'
  },
  {
    icon: Headphones,
    label: 'IT Support',
    query: 'How do I contact IT support?'
  },
  {
    icon: Shirt,
    label: 'Dress Code',
    query: 'What is our dress code policy?'
  },
  {
    icon: UserCircle,
    label: 'Employee Portal',
    query: 'How do I access the employee portal?'
  },
];

export function WelcomeScreen({ onQuickAction }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center max-w-2xl">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <MessageCircle className="h-10 w-10 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Knowledge Assistant
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Get instant answers from our comprehensive knowledge base. Ask about policies, procedures, guidelines, and more.
        </p>
        
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">Quick Actions</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto flex-col gap-3 p-4 hover:bg-gray-50 hover:border-primary-500 group transition-all"
                  onClick={() => onQuickAction(action.query)}
                >
                  <Icon className="h-6 w-6 text-primary-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-center leading-tight">
                    {action.label}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}