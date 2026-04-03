import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("resources/chords", "routes/Chords.tsx"),
  route("resources/scales", "routes/Scales.tsx"),
  route("resources/mode-quiz", "routes/ModeQuiz.tsx"),
] satisfies RouteConfig;