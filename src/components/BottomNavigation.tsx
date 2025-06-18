import { Home, Settings, Bell, Info, MapPin } from 'lucide-react';
import type { TabType } from '../types';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  uiMode: 'advance' | 'basic';
}

export function BottomNavigation({ activeTab, onTabChange, uiMode }: BottomNavigationProps) {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'nearby' as const, label: 'Nearby', icon: MapPin },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
    { id: 'notifications' as const, label: 'Alerts', icon: Bell },
    { id: 'info' as const, label: 'About', icon: Info },
  ].filter(tab =>
    uiMode === 'advance' ? true : tab.id !== 'home' && tab.id !== 'notifications'
  );

  return (
    <nav
      className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[480px] bg-background/95 backdrop-blur-xl border-t border-border/50 z-50"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) / 2)' }}
    >
      <div className="flex justify-around items-center py-2 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center p-3 duration-300 ease-out rounded-xl ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              }`}
            >
              {/* Active background indicator */}
              {/* Removed background indicator for selected tab */}
              
              {/* Icon with subtle animation */}
              <div className="relative z-10">
                <Icon 
                  className="w-7 h-7 aspect-square mb-1" 
                />
              </div>
              
              {/* Label with fade effect */}
              <span 
                className={`relative z-10 text-xs font-medium duration-300 ease-out ${
                  isActive ? 'opacity-100 font-semibold' : 'opacity-70'
                }`}
              >
                {tab.label}
              </span>
              
              {/* Active indicator dot */}
              <div 
                className={`absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-primary duration-300 ease-out ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
} 