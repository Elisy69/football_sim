import { run } from "./run";

var startSimulation = document.getElementById("start_simulation");
startSimulation?.addEventListener("click", () => {
  console.log("simulation running");
  run();
});
