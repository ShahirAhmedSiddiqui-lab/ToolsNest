import { Activity, Calculator, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const HealthCalculators = () => {
  return (
    <div className="flex-1 w-full p-margin-mobile md:p-margin-desktop">
      <div className="max-w-[1440px] mx-auto mb-12">
        <Breadcrumbs />
        <h1 className="text-3xl md:text-4xl font-bold text-heading-navy mb-2 flex items-center gap-3">
          <div className="bg-primary/10 p-1.5 rounded-lg text-primary inline-flex">
            <Activity className="w-6 h-6" />
          </div>
          Health Calculators
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl">
          Essential wellness metrics and health tracking calculators.
        </p>
      </div>
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "BMI Calculator", desc: "Calculate your Body Mass Index.", href: "/calculators/bmi" },
          { title: "Calorie Calculator", desc: "Calculate your daily calorie needs.", href: "/calculators/calories" },
          { title: "TDEE Calculator", desc: "Calculate your Total Daily Energy Expenditure.", href: "/calculators/tdee" }
        ].map(tool => (
          <Link key={tool.title} to={tool.href} className="bg-surface-container-lowest border border-border-slate rounded-xl p-6 hover:shadow-md transition-all group flex flex-col">
            <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center mb-4 text-primary">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-heading-navy mb-2">{tool.title}</h3>
            <p className="text-base text-on-surface-variant mb-6">{tool.desc}</p>
            <div className="mt-auto flex items-center gap-2 text-primary font-medium group-hover:translate-x-1 transition-transform">
               Open <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};