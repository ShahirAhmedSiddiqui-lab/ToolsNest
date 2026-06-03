import { useState } from "react";
import { Activity, Zap, AlertTriangle } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { cn } from "../lib/utils";

export const CalorieCalculator = () => {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("25");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [heightCm, setHeightCm] = useState("175");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("9");
  
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [weight, setWeight] = useState("70");
  
  const [activityLevel, setActivityLevel] = useState("1.55");
  
  const [goal, setGoal] = useState<"maintain" | "lose" | "gain">("maintain");
  const [goalWeight, setGoalWeight] = useState("65");
  const [timelineWeeks, setTimelineWeeks] = useState("12");
  
  const [diet, setDiet] = useState<"balanced" | "lowCarb" | "highProtein" | "keto">("balanced");

  // Calculate Base BMR
  let w = parseFloat(weight) || 0;
  if (weightUnit === "lb") w = w * 0.453592;
  
  let h = parseFloat(heightCm) || 0;
  if (heightUnit === "ft") h = ((parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0)) * 2.54;
  
  let a = parseFloat(age) || 0;
  
  let bmr = 0;
  if (w > 0 && h > 0 && a > 0) {
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }
  }

  const tdee = bmr * parseFloat(activityLevel);
  
  let dailyCalories = tdee;
  let safetyWarning = "";
  let weeklyChangeKg = 0;
  let weeklyChangeLb = 0;

  if (goal !== "maintain") {
    let targetWeightKg = parseFloat(goalWeight) || w;
    if (weightUnit === "lb") targetWeightKg = targetWeightKg * 0.453592;
    
    let weightDiffKg = targetWeightKg - w;
    let weeks = parseFloat(timelineWeeks) || 12;
    
    if (weeks > 0 && weightDiffKg !== 0) {
       // 1 kg body weight = ~7700 kcal
       let totalCalorieDiff = weightDiffKg * 7700;
       let dailyCalorieDiff = totalCalorieDiff / (weeks * 7);
       dailyCalories = tdee + dailyCalorieDiff;
       weeklyChangeKg = weightDiffKg / weeks;
       weeklyChangeLb = weeklyChangeKg * 2.20462;
       
       if (goal === "lose" && dailyCalories < (gender === "male" ? 1500 : 1200)) {
         safetyWarning = `Warning: ${Math.round(dailyCalories)} kcal/day is considered too low for healthy weight loss. The minimum recommended is ${gender === 'male' ? 1500 : 1200} kcal/day. Please increase your timeline or adjust your target.`;
       }
       if (goal === "lose" && Math.abs(weeklyChangeKg) > 1) {
         safetyWarning = `Warning: Losing ${Math.abs(weeklyChangeKg).toFixed(1)} kg (${Math.abs(weeklyChangeLb).toFixed(1)} lbs) per week is very aggressive. A safe rate is 0.5 - 1 kg per week.`;
       }
       if (goal === "gain" && weeklyChangeKg > 1) {
         safetyWarning = `Warning: Gaining ${weeklyChangeKg.toFixed(1)} kg (${weeklyChangeLb.toFixed(1)} lbs) per week is very aggressive. A lean bulk targets 0.2 - 0.5 kg per week.`;
       }
    }
  }

  // Macros
  let pPct = 0.3, cPct = 0.4, fPct = 0.3;
  if (diet === "lowCarb") { pPct = 0.4; cPct = 0.2; fPct = 0.4; }
  else if (diet === "highProtein") { pPct = 0.4; cPct = 0.3; fPct = 0.3; }
  else if (diet === "keto") { pPct = 0.2; cPct = 0.05; fPct = 0.75; }

  const protein = (dailyCalories * pPct) / 4;
  const carbs = (dailyCalories * cPct) / 4;
  const fats = (dailyCalories * fPct) / 9;

  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12 flex justify-center">
      <div className="w-full max-w-6xl">
        <div className="mb-8">
          <Breadcrumbs />
          <h1 className="text-3xl lg:text-4xl font-bold text-heading-navy mb-2 flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <Zap className="w-8 h-8" />
            </div>
            Calorie Calculator
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            Determine your daily calorie needs and optimal macronutrient split for your specific goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-6 lg:p-8 space-y-6">
              <h2 className="text-xl font-bold text-heading-navy border-b border-border-slate pb-4">Personal Details</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-heading-navy mb-2">Gender</label>
                  <div className="flex gap-2">
                    <button onClick={() => setGender("male")} className={cn("flex-1 py-2 rounded-lg border text-sm font-medium transition-all", gender === "male" ? "bg-primary/10 border-primary text-primary" : "bg-surface border-border-slate text-on-surface-variant")}>Male</button>
                    <button onClick={() => setGender("female")} className={cn("flex-1 py-2 rounded-lg border text-sm font-medium transition-all", gender === "female" ? "bg-primary/10 border-primary text-primary" : "bg-surface border-border-slate text-on-surface-variant")}>Female</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-heading-navy mb-2">Age</label>
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-surface border border-border-slate rounded-lg px-4 py-2.5 text-heading-navy focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-semibold text-heading-navy">Height</label>
                    <div className="flex gap-2 text-xs font-medium">
                      <button onClick={() => setHeightUnit("cm")} className={heightUnit === "cm" ? "text-primary" : "text-on-surface-variant"}>cm</button>
                      <span className="text-border-slate">|</span>
                      <button onClick={() => setHeightUnit("ft")} className={heightUnit === "ft" ? "text-primary" : "text-on-surface-variant"}>ft/in</button>
                    </div>
                  </div>
                  {heightUnit === "cm" ? (
                    <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="cm" className="w-full bg-surface border border-border-slate rounded-lg px-4 py-2.5 text-heading-navy focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                  ) : (
                    <div className="flex gap-2">
                      <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} placeholder="ft" className="w-full bg-surface border border-border-slate rounded-lg px-4 py-2.5 text-heading-navy focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                      <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} placeholder="in" className="w-full bg-surface border border-border-slate rounded-lg px-4 py-2.5 text-heading-navy focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-semibold text-heading-navy">Weight</label>
                    <div className="flex gap-2 text-xs font-medium">
                      <button onClick={() => setWeightUnit("kg")} className={weightUnit === "kg" ? "text-primary" : "text-on-surface-variant"}>kg</button>
                      <span className="text-border-slate">|</span>
                      <button onClick={() => setWeightUnit("lb")} className={weightUnit === "lb" ? "text-primary" : "text-on-surface-variant"}>lb</button>
                    </div>
                  </div>
                  <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-surface border border-border-slate rounded-lg px-4 py-2.5 text-heading-navy focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-heading-navy mb-2">Activity Level</label>
                <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} className="w-full bg-surface border border-border-slate rounded-lg px-4 py-2.5 text-heading-navy focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                  <option value="1.2">Sedentary (little or no exercise)</option>
                  <option value="1.375">Lightly active (light exercise/sports 1-3 days/week)</option>
                  <option value="1.55">Moderately active (moderate exercise/sports 3-5 days/week)</option>
                  <option value="1.725">Very active (hard exercise/sports 6-7 days a week)</option>
                  <option value="1.9">Extra active (very hard exercise/sports & physical job)</option>
                </select>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-6 lg:p-8 space-y-6">
              <h2 className="text-xl font-bold text-heading-navy border-b border-border-slate pb-4">Goal & Diet</h2>
              
              <div>
                <label className="block text-sm font-semibold text-heading-navy mb-2">Your Goal</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button onClick={() => setGoal("maintain")} className={cn("flex-1 py-2 rounded-lg border text-sm font-medium transition-all", goal === "maintain" ? "bg-primary/10 border-primary text-primary" : "bg-surface border-border-slate text-on-surface-variant")}>Maintain Weight</button>
                  <button onClick={() => setGoal("lose")} className={cn("flex-1 py-2 rounded-lg border text-sm font-medium transition-all", goal === "lose" ? "bg-primary/10 border-primary text-primary" : "bg-surface border-border-slate text-on-surface-variant")}>Lose Weight</button>
                  <button onClick={() => setGoal("gain")} className={cn("flex-1 py-2 rounded-lg border text-sm font-medium transition-all", goal === "gain" ? "bg-primary/10 border-primary text-primary" : "bg-surface border-border-slate text-on-surface-variant")}>Gain Weight</button>
                </div>
              </div>

              {goal !== "maintain" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-heading-navy mb-2">Target Weight ({weightUnit})</label>
                    <input type="number" value={goalWeight} onChange={(e) => setGoalWeight(e.target.value)} className="w-full bg-surface border border-border-slate rounded-lg px-4 py-2.5 text-heading-navy focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-heading-navy mb-2">Timeline (Weeks)</label>
                    <input type="number" value={timelineWeeks} onChange={(e) => setTimelineWeeks(e.target.value)} className="w-full bg-surface border border-border-slate rounded-lg px-4 py-2.5 text-heading-navy focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-heading-navy mb-2">Diet Preference</label>
                <select value={diet} onChange={(e) => setDiet(e.target.value as any)} className="w-full bg-surface border border-border-slate rounded-lg px-4 py-2.5 text-heading-navy focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                  <option value="balanced">Balanced (30% P / 40% C / 30% F)</option>
                  <option value="lowCarb">Low Carb (40% P / 20% C / 40% F)</option>
                  <option value="highProtein">High Protein (40% P / 30% C / 30% F)</option>
                  <option value="keto">Ketogenic (20% P / 5% C / 75% F)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-5">
            <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-6 lg:p-8 sticky top-24">
              <h2 className="text-xl font-bold text-heading-navy mb-6 text-center">Your Results</h2>
              
              <div className="text-center mb-8">
                <div className="text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-2">Target Calories</div>
                <div className="text-5xl font-bold text-primary mb-2">
                  {bmr > 0 ? Math.max(0, Math.round(dailyCalories)).toLocaleString() : "0"}
                </div>
                <div className="text-on-surface-variant text-sm">kcal / day</div>
              </div>

              {bmr > 0 && goal !== "maintain" && (
                <div className="mb-6 p-4 rounded-xl bg-surface-container-low border border-border-slate text-center">
                  <div className="text-sm text-on-surface-variant mb-1">Estimated Change</div>
                  <div className="font-semibold text-heading-navy">
                    {goal === "lose" ? "Losing" : "Gaining"} {Math.abs(weeklyChangeKg).toFixed(2)} kg ({Math.abs(weeklyChangeLb).toFixed(2)} lb) per week
                  </div>
                </div>
              )}

              {safetyWarning && (
                <div className="mb-8 flex items-start gap-3 p-4 bg-error/10 text-error rounded-xl border border-error/20">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">{safetyWarning}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="text-sm font-bold text-heading-navy uppercase tracking-wider mb-2">Macronutrients</div>
                
                <div className="bg-surface-container px-4 py-3 rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="font-medium text-heading-navy">Protein</span>
                  </div>
                  <div className="font-bold text-heading-navy">{bmr > 0 ? Math.round(protein) : 0}g</div>
                </div>

                <div className="bg-surface-container px-4 py-3 rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="font-medium text-heading-navy">Carbs</span>
                  </div>
                  <div className="font-bold text-heading-navy">{bmr > 0 ? Math.round(carbs) : 0}g</div>
                </div>

                <div className="bg-surface-container px-4 py-3 rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="font-medium text-heading-navy">Fats</span>
                  </div>
                  <div className="font-bold text-heading-navy">{bmr > 0 ? Math.round(fats) : 0}g</div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border-slate text-center text-xs text-on-surface-variant">
                Maintenance Calories (TDEE): {bmr > 0 ? Math.round(tdee).toLocaleString() : 0} kcal/day
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};