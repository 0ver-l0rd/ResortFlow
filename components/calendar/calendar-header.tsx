"use client";

import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  viewMode: "month" | "week" | "day";
  onViewModeChange: (mode: "month" | "week" | "day") => void;
  selectedPlatform: string | null;
  onPlatformChange: (val: string | null) => void;
  selectedStatus: string | null;
  onStatusChange: (val: string | null) => void;
  mainView: "calendar" | "all-posts";
  onMainViewChange: (view: "calendar" | "all-posts") => void;
}

export function CalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  viewMode,
  onViewModeChange,
  selectedPlatform,
  onPlatformChange,
  selectedStatus,
  onStatusChange,
  mainView,
  onMainViewChange,
}: CalendarHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
      {/* Date Navigation */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold min-w-[180px] text-gray-900">
          {format(currentDate, viewMode === "day" ? "MMMM d, yyyy" : "MMMM yyyy")}
        </h1>
        <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
          <Button variant="ghost" size="icon" onClick={onPrevMonth} className="h-8 w-8 rounded-r-none border-r border-gray-200">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={onToday} className="h-8 px-4 rounded-none h-auto font-medium text-sm">
            Today
          </Button>
          <Button variant="ghost" size="icon" onClick={onNextMonth} className="h-8 w-8 rounded-l-none border-l border-gray-200">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Main View Toggle */}
        <div className="p-1 bg-gray-100/80 rounded-lg flex items-center border border-gray-200 mr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMainViewChange("calendar")}
            className={`h-8 px-4 text-sm rounded-md transition-all ${
              mainView === "calendar" ? "bg-white shadow-sm font-semibold text-gray-900" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Calendar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMainViewChange("all-posts")}
            className={`h-8 px-4 text-sm rounded-md transition-all ${
              mainView === "all-posts" ? "bg-white shadow-sm font-semibold text-gray-900" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            All Posts
          </Button>
        </div>

        {/* Filters */}
        <Popover>
          <PopoverTrigger
            render={
              <Button variant="outline" size="sm" className="bg-white border-gray-200 h-9 gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {(selectedPlatform || selectedStatus) && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 rounded bg-indigo-100 text-indigo-700">
                    {(selectedPlatform ? 1 : 0) + (selectedStatus ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            }
          />
          <PopoverContent className="w-56 p-4" align="end">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Filter Posts</h4>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500">Platform</label>
                <Select value={selectedPlatform || "all"} onValueChange={(val) => onPlatformChange(val === "all" ? null : val)}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="All Platforms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500">Status</label>
                <Select value={selectedStatus || "all"} onValueChange={(val) => onStatusChange(val === "all" ? null : val)}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* View Mode */}
        {mainView === "calendar" && (
          <div className="p-1 bg-gray-100/80 rounded-lg flex items-center border border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange("month")}
              className={`h-7 px-3 text-sm rounded-md transition-all ${
                viewMode === "month" ? "bg-white shadow-sm font-semibold text-gray-900" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Month
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange("week")}
              className={`h-7 px-3 text-sm rounded-md transition-all ${
                viewMode === "week" ? "bg-white shadow-sm font-semibold text-gray-900" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Week
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange("day")}
              className={`h-7 px-3 text-sm rounded-md transition-all ${
                viewMode === "day" ? "bg-white shadow-sm font-semibold text-gray-900" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Day
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
