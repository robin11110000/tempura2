import { Search, User, ChevronLeft, ChevronRight } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const Calendar = () => {
  const [currentMonth] = useState("January 2025");
  
  const schedule = [
    { day: "Monday", series: ["Finding Camelia", "The Queen", "Destiny"] },
    { day: "Tuesday", series: ["My Lucky Star", "Little Flower"] },
    { day: "Wednesday", series: ["Finding Camelia", "Who Are You"] },
    { day: "Thursday", series: ["It May Happen", "The Queen"] },
    { day: "Friday", series: ["Finding Camelia", "Destiny", "My Lucky Star"] },
    { day: "Saturday", series: ["That Day in the Park", "Little Flower"] },
    { day: "Sunday", series: ["I Don't Care About You"] },
  ];

  return (
    <div className="min-h-screen bg-gradient-primary pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-glow">
          <span className="text-lg font-bold text-primary">📚</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">Calendar</h1>
        <div className="flex items-center gap-3">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-glow">
            <User className="w-5 h-5 text-primary" />
          </button>
        </div>
      </header>

      {/* Month Selector */}
      <section className="px-6 mt-6">
        <div className="flex items-center justify-between bg-card/30 rounded-xl p-4">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">{currentMonth}</h2>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Release Schedule */}
      <section className="px-6 mt-8">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Weekly Release Schedule</h3>
        <div className="space-y-4">
          {schedule.map((day) => (
            <div key={day.day} className="bg-card/30 rounded-xl p-4">
              <h4 className="text-base font-semibold text-foreground mb-3">{day.day}</h4>
              <div className="flex flex-wrap gap-2">
                {day.series.map((series, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {series}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <BottomNav />
    </div>
  );
};

export default Calendar;
