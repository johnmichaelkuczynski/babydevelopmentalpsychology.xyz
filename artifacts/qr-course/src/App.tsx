import { useEffect } from "react";
import {
  Switch,
  Route,
  Router as WouterRouter,
  useLocation,
} from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  setExtraHeadersGetter,
  recordVisit,
} from "@workspace/api-client-react";
import { getAnonId } from "@/lib/anon";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Assignments from "@/pages/Assignments";
import Analytics from "@/pages/Analytics";
import WeekView from "@/pages/WeekView";
import LectureView from "@/pages/LectureView";
import AssignmentRunner from "@/pages/AssignmentRunner";
import PracticeAssignment from "@/pages/PracticeAssignment";
import Diagnostics from "@/pages/Diagnostics";
import TopicPractice from "@/pages/TopicPractice";
import Reasoning from "@/pages/Reasoning";
import ReasoningRunner from "@/pages/ReasoningRunner";
import Grades from "@/pages/Grades";
import AdminMode from "@/pages/AdminMode";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const queryClient = new QueryClient();

// Attach the anonymous visitor id to API calls for visitor counting.
setExtraHeadersGetter(() => ({ "x-anon-id": getAnonId() }));

// Count the visit once per browser session.
if (!sessionStorage.getItem("bdp-visit-recorded")) {
  sessionStorage.setItem("bdp-visit-recorded", "1");
  recordVisit().catch(() => {});
}

const ROUTE_TITLES: Array<[RegExp, string]> = [
  [/^\/$/, "Basic Developmental Psychology — Free AI-Taught Online Course"],
  [/^\/dashboard/, "Dashboard — Basic Developmental Psychology"],
  [/^\/assignments/, "Assignments & Exams — Basic Developmental Psychology"],
  [/^\/analytics/, "Progress Analytics — Basic Developmental Psychology"],
  [/^\/reasoning/, "Diagnostics — Basic Developmental Psychology"],
  [/^\/grades/, "Grades — Basic Developmental Psychology"],
  [/^\/weeks/, "Course Unit — Basic Developmental Psychology"],
  [/^\/lectures/, "Lecture — Basic Developmental Psychology"],
  [/^\/practice/, "Adaptive Practice — Basic Developmental Psychology"],
];

function RouteTitle() {
  const [location] = useLocation();
  useEffect(() => {
    const match = ROUTE_TITLES.find(([re]) => re.test(location));
    document.title = match
      ? match[1]
      : "Basic Developmental Psychology — Free AI-Taught Online Course";
  }, [location]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/assignments" component={Assignments} />
      <Route path="/assignments/:id/practice" component={PracticeAssignment} />
      <Route path="/assignments/:id" component={AssignmentRunner} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/reasoning" component={Reasoning} />
      <Route path="/reasoning/:id" component={ReasoningRunner} />
      <Route path="/grades" component={Grades} />
      <Route path="/weeks/:weekNumber" component={WeekView} />
      <Route path="/lectures/:lectureId" component={LectureView} />
      <Route path="/practice/topic/:topicId" component={TopicPractice} />
      <Route path="/admin" component={AdminMode} />
      <Route path="/diagnostics" component={Diagnostics} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <RouteTitle />
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </WouterRouter>
  );
}

export default App;
