import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { RefreshCw, MapPin, Bell, Github, ExternalLink, Code2, Star, Heart } from 'lucide-react';
import busIcon from "@/assets/bus.png";

export function About() {
  return (
    <div className="space-y-4 pb-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <Card className="border-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 text-white">
          <CardContent className="p-6 text-center relative">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 animate-pulse">
                <img
                  src={busIcon}
                  alt="Bus"
                  className="w-8 h-8 bg-white dark:bg-gray-800 rounded p-1"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
              <div className="absolute top-8 right-8 animate-bounce">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="absolute bottom-6 left-8 animate-pulse delay-300">
                <Bell className="w-5 h-5" />
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="mb-4">
                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 mx-auto mb-2">
                  <img
                    src={busIcon}
                    alt="SG Bus Logo"
                    className="w-full h-full object-contain"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-2">SG Bus Arrival</h1>
              <p className="text-blue-100 text-sm">
                Real-time bus tracking for Singapore commuters
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Star className="w-5 h-5 text-yellow-500" />
            Key Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Pin Your Stops</h4>
              <p className="text-xs text-muted-foreground">Save frequently used bus stops for quick access</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Live Updates</h4>
              <p className="text-xs text-muted-foreground">Real-time bus arrival information</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Smart Notifications</h4>
              <p className="text-xs text-muted-foreground">Get notified before your bus arrives</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connect Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="w-5 h-5 text-red-500" />
            Connect with Me
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 h-12 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900"
              onClick={() => window.open('https://github.com/tuhuynh27', '_blank')}
            >
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="text-sm font-medium">GitHub</div>
                <div className="text-xs text-muted-foreground group-hover:text-gray-300 dark:group-hover:text-gray-600">@tuhuynh27</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 h-12 hover:bg-blue-600 hover:text-white"
              onClick={() => window.open('https://tuhuynh.com', '_blank')}
            >
              <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="text-sm font-medium">Blog</div>
                <div className="text-xs text-muted-foreground group-hover:text-blue-100">tuhuynh.com</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Code2 className="w-5 h-5 text-blue-500" />
            Built With
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'React', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
              { name: 'TypeScript', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
              { name: 'Vite', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
              { name: 'TanStack Query', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
              { name: 'shadcn/ui', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' },
              { name: 'Tailwind CSS', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200' },
            ].map((tech) => (
              <Badge key={tech.name} className={`${tech.color} border-0 text-xs px-2 py-1`}>
                {tech.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground">
          Made with <Heart className="w-3 h-3 inline text-red-500" /> for Singapore commuters
        </p>
      </div>
    </div>
  );
} 