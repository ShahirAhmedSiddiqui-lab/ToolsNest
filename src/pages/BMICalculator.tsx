import { useState } from "react";
import { Activity, Info } from "lucide-react";
import { cn } from "../lib/utils";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const BMICalculator = () => {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [heightValue, setHeightValue] = useState("175");
  const [weightValue, setWeightValue] = useState("70");
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("9");

  // Calculate BMI
  let bmi = 0;
  if (unit === "metric") {
    const h = parseFloat(heightValue) / 100;
    const w = parseFloat(weightValue);
    if (h > 0 && w > 0) bmi = w / (h * h);
  } else {
    const totalInches = parseFloat(feet) * 12 + parseFloat(inches);
    const w = parseFloat(weightValue);
    if (totalInches > 0 && w > 0) bmi = (w / (totalInches * totalInches)) * 703;
  }

  const roundedBmi = isNaN(bmi) || bmi === 0 ? "0.0" : bmi.toFixed(1);

  let status = "Calculate BMI";
  let statusColor = "text-on-surface-variant";
  if (bmi > 0) {
    if (bmi < 18.5) { status = "Underweight"; statusColor = "text-link-blue"; }
    else if (bmi < 25) { status = "Healthy Weight"; statusColor = "text-success-teal"; }
    else if (bmi < 30) { status = "Overweight"; statusColor = "text-orange-500"; }
    else { status = "Obese"; statusColor = "text-error"; }
  }

  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12 flex justify-center">
      <div className="w-full max-w-3xl">
        <div className="mb-8">
          <Breadcrumbs />
          <h1 className="text-3xl lg:text-4xl font-bold text-heading-navy mb-2 flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <Activity className="w-8 h-8" />
            </div>
            BMI Calculator
          </h1>
          <p className="text-lg text-on-surface-variant">
            A precise tool to determine your Body Mass Index (BMI). All calculations run instantly in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Inputs */}
          <div className="md:col-span-7 bg-surface-container-lowest border border-border-slate rounded-xl p-6 lg:p-8">
            {/* Unit Toggle */}
            <div className="flex p-1 bg-surface-container border border-border-slate rounded-lg mb-8">
              <button 
                onClick={() => setUnit("metric")}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                  unit === "metric" ? "bg-surface-container-lowest text-heading-navy shadow-sm" : "text-on-surface-variant hover:text-heading-navy"
                )}
              >
                Metric (kg/cm)
              </button>
              <button 
                onClick={() => setUnit("imperial")}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                  unit === "imperial" ? "bg-surface-container-lowest text-heading-navy shadow-sm" : "text-on-surface-variant hover:text-heading-navy"
                )}
              >
                Imperial (lb/ft)
              </button>
            </div>

            <div className="space-y-6">
              {/* Height Input */}
              <div>
                <label className="block text-sm font-semibold text-heading-navy mb-2">Height</label>
                {unit === "metric" ? (
                  <div className="relative">
                    <input 
                      type="number" 
                      value={heightValue}
                      onChange={(e) => setHeightValue(e.target.value)}
                      className="w-full bg-surface border border-border-slate rounded-lg px-4 py-3 pr-12 text-heading-navy font-mono text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">cm</span>
                  </div>
                ) : (
                  <div className="flex gap-4">
                     <div className="relative flex-1">
                      <input 
                        type="number" 
                        value={feet}
                        onChange={(e) => setFeet(e.target.value)}
                        className="w-full bg-surface border border-border-slate rounded-lg px-4 py-3 pr-10 text-heading-navy font-mono text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">ft</span>
                    </div>
                    <div className="relative flex-1">
                      <input 
                        type="number" 
                        value={inches}
                        onChange={(e) => setInches(e.target.value)}
                        className="w-full bg-surface border border-border-slate rounded-lg px-4 py-3 pr-10 text-heading-navy font-mono text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">in</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Weight Input */}
              <div>
                <label className="block text-sm font-semibold text-heading-navy mb-2">Weight</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={weightValue}
                    onChange={(e) => setWeightValue(e.target.value)}
                    className="w-full bg-surface border border-border-slate rounded-lg px-4 py-3 pr-12 text-heading-navy font-mono text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">
                    {unit === "metric" ? "kg" : "lb"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex items-start gap-3 p-4 bg-surface-container-low rounded-lg border border-border-slate">
              <Info className="w-5 h-5 text-on-surface-variant shrink-0 mt-0.5" />
              <p className="text-sm text-on-surface-variant leading-relaxed">
                BMI is a useful measure of overweight and obesity. It is calculated from your weight and height. For adults, a healthy BMI is between 18.5 and 24.9.
              </p>
            </div>
          </div>

          {/* Results */}
          <div className="md:col-span-5">
            <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-8 flex flex-col items-center justify-center text-center h-full sticky top-24">
              <div className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Your Result</div>
              
              <div className="relative flex items-center justify-center w-48 h-48 my-4">
                {/* SVG Circular Progress Placeholder */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-surface-container-high)" strokeWidth="6" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" 
                    strokeDasharray="283"
                    strokeDashoffset={bmi > 0 ? Math.max(0, 283 - (Math.min(bmi, 40) / 40) * 283) : 283}
                    className={cn("transition-all duration-1000 ease-out", statusColor)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold text-heading-navy">{roundedBmi}</div>
                  <div className="text-sm font-medium text-on-surface-variant mt-1">BMI</div>
                </div>
              </div>

              <div className={cn("text-xl font-bold mt-4 px-4 py-1.5 rounded-full border", 
                bmi > 0 ? `${statusColor.replace('text-', 'bg-')}/10 ${statusColor}` : "bg-surface-container-low border-border-slate text-on-surface-variant"
              )}>
                {status}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
