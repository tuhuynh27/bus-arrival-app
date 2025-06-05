import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import type { StationConfig, StopData, ServiceData } from '../types';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface StationSuggestion {
  stationId: string;
  name: string;
  road: string;
  displayName: string;
}

interface StationConfigProps {
  stationConfigs: StationConfig[];
  onUpdateConfigs: (configs: StationConfig[]) => void;
  stopsData: StopData;
  servicesData: ServiceData;
}

function SortableStationCard({
  config,
  children,
}: {
  config: StationConfig;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: config.stationId });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none',
    opacity: isDragging ? 0.8 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export function StationConfigComponent({ 
  stationConfigs, 
  onUpdateConfigs, 
  stopsData, 
  servicesData 
}: StationConfigProps) {
  const [newStationInput, setNewStationInput] = useState('');
  const [stationSuggestions, setStationSuggestions] = useState<StationSuggestion[]>([]);

  const handleStationInputFocus = () => {
    if (newStationInput.trim().length > 0) return;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (newStationInput.trim().length > 0) return;
          const { latitude, longitude } = pos.coords;
          const suggestions = Object.keys(stopsData)
            .map((stationId) => {
              const stop = stopsData[stationId];
              const distance = Math.sqrt(
                Math.pow(stop[1] - latitude, 2) +
                Math.pow(stop[0] - longitude, 2)
              );
              return {
                stationId,
                name: stop[2],
                road: stop[3],
                displayName: `${stop[2]} (${stop[3]}) [${stationId}]`,
                distance,
              };
            })
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5)
            .map(({ stationId, name, road, displayName }) => ({ stationId, name, road, displayName }));
          setStationSuggestions(suggestions);
        },
        () => {
          toast.error('Unable to retrieve your location');
        },
        { enableHighAccuracy: true, maximumAge: 600000, timeout: 5000 }
      );
    } else {
      toast.error('Geolocation not supported');
    }
  };

  const getStationDisplayName = (stationId: string, truncate = false) => {
    const stop = stopsData[stationId];
    if (stop) {
      const fullName = `${stop[2]} (${stop[3]})`;
      if (truncate && fullName.length > 30) {
        return `${fullName.slice(0, 30)}...`;
      }
      return fullName;
    }
    return stationId;
  };

  const stationToBusNumbers = useMemo(() => {
    const mapping: Record<string, Set<string>> = {};
    Object.keys(servicesData).forEach(busNo => {
      servicesData[busNo].routes.forEach(route => {
        route.forEach(stationId => {
          if (!mapping[stationId]) {
            mapping[stationId] = new Set();
          }
          mapping[stationId].add(busNo);
        });
      });
    });

    const mappingArrays: Record<string, string[]> = {};
    Object.keys(mapping).forEach(stationId => {
      mappingArrays[stationId] = Array.from(mapping[stationId]).sort((a, b) => {
        // Sort numerically for bus numbers
        const numA = parseInt(a);
        const numB = parseInt(b);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return a.localeCompare(b);
      });
    });
    return mappingArrays;
  }, [servicesData]);

  const handleStationInputChange = (value: string) => {
    setNewStationInput(value);

    if (value.length >= 2 && stopsData) {
      const suggestions = Object.keys(stopsData).map(stationId => {
        const stop = stopsData[stationId];
        return {
          stationId: stationId,
          name: stop[2],
          road: stop[3],
          displayName: `${stop[2]} (${stop[3]}) [${stationId}]`,
        };
      }).filter(stop => {
        const searchValue = value.toLowerCase();
        return stop.name.toLowerCase().includes(searchValue) || 
               stop.road.toLowerCase().includes(searchValue) ||
               stop.stationId.includes(value);
      }).slice(0, 5);

      setStationSuggestions(suggestions);
    } else {
      setStationSuggestions([]);
    }
  };

  const addStation = (e: React.FormEvent) => {
    e.preventDefault();
    // Extract station ID from input (could be full display name or just ID)
    let stationId = newStationInput.trim();
    
    // If input contains brackets, extract the ID from within them
    const bracketMatch = stationId.match(/\[([^\]]+)\]$/);
    if (bracketMatch) {
      stationId = bracketMatch[1];
    }
    
    if (stationId && !stationConfigs.find(s => s.stationId === stationId)) {
      const updatedConfigs = [...stationConfigs, { stationId: stationId, busNumbers: [] }];
      onUpdateConfigs(updatedConfigs);
      setNewStationInput('');
      setStationSuggestions([]);
    }
  };

  const removeStation = (stationId: string) => {
    const updatedConfigs = stationConfigs.filter(s => s.stationId !== stationId);
    onUpdateConfigs(updatedConfigs);
  };


  const addBusNumberDirect = (stationId: string, busNo: string) => {
    const updatedConfigs = stationConfigs.map(s => {
      if (s.stationId === stationId && !s.busNumbers.includes(busNo)) {
        return { ...s, busNumbers: [...s.busNumbers, busNo] };
      }
      return s;
    });
    onUpdateConfigs(updatedConfigs);
  };

  const removeBusNumber = (stationId: string, busNo: string) => {
    const updatedConfigs = stationConfigs.map(s => {
      if (s.stationId === stationId) {
        return { ...s, busNumbers: s.busNumbers.filter(no => no !== busNo) };
      }
      return s;
    });
    onUpdateConfigs(updatedConfigs);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = stationConfigs.findIndex((s) => s.stationId === active.id);
      const newIndex = stationConfigs.findIndex((s) => s.stationId === over.id);
      onUpdateConfigs(arrayMove(stationConfigs, oldIndex, newIndex));
    }
  };

  const handleStationSelect = (suggestion: StationSuggestion) => {
    setNewStationInput(suggestion.displayName);
    setStationSuggestions([]);
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center">
            <Plus className="mr-2 w-5 h-5" />
            Add Bus Station
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Nearby stops will be suggested using your location. Please allow access.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={addStation} className="flex gap-2 relative">
            <div className="relative flex-1">
              <Input
                placeholder="Enter Station ID or Name"
                value={newStationInput}
                onChange={(e) => handleStationInputChange(e.target.value)}
                onFocus={handleStationInputFocus}
                onBlur={() => {
                  setTimeout(() => {
                    setStationSuggestions([])
                  }, 100)
                }}
                className="text-base placeholder:text-base"
              />
              {stationSuggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-background border border-border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                  {stationSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-3 hover:bg-accent cursor-pointer text-sm border-b border-border/50 last:border-b-0"
                      onClick={() => handleStationSelect(suggestion)}
                    >
                      <div className="font-medium text-foreground">{suggestion.name}</div>
                      <div className="text-xs text-muted-foreground">{suggestion.road} • {suggestion.stationId}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button type="submit" size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={stationConfigs.map((s) => s.stationId)} strategy={verticalListSortingStrategy}>
          {stationConfigs.map((config) => {
            const availableBuses = stationToBusNumbers[config.stationId] || [];

            return (
              <SortableStationCard key={config.stationId} config={config}>
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg break-words">
                          {getStationDisplayName(config.stationId, true)}
                  </CardTitle>
                  <div className="text-xs text-muted-foreground mt-1">
                    ID: {config.stationId}
                    {availableBuses.length > 0 && (
                      <span className="ml-2">• {availableBuses.length} buses serve this stop</span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStation(config.stationId)}
                  className="flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                {config.busNumbers.map(busNo => (
                  <Badge key={busNo} variant="secondary" className="min-w-[40px] min-h-[40px] h-10 px-4 py-2 text-base flex items-center justify-center rounded-lg gap-1">
                    {busNo}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeBusNumber(config.stationId, busNo)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>

              {availableBuses.length > 0 && (
                <div className="mt-3 p-3 bg-muted/50 rounded-md">
                  <div className="text-xs font-medium text-muted-foreground mb-2">
                    Buses serving this station (tap to add):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableBuses.map(busNo => (
                      <Badge
                        key={busNo}
                        variant="outline"
                        className="min-w-[40px] min-h-[40px] h-10 px-4 py-2 text-base cursor-pointer hover:bg-accent flex items-center justify-center rounded-lg"
                        onClick={() => {
                          if (!config.busNumbers.includes(busNo)) {
                            addBusNumberDirect(config.stationId, busNo);
                          }
                        }}
                      >
                        {busNo}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
              </SortableStationCard>
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
} 