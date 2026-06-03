import { useState } from "react";
import { GraduationCap, Plus, X, BarChart3 } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";

interface Subject {
  id: string;
  name: string;
  grade: string;
  credits: string;
}

interface Semester {
  id: string;
  name: string;
  subjects: Subject[];
}

const gradePoints: { [key: string]: number } = {
  "O": 10,
  "A+": 9,
  "A": 8,
  "B+": 7,
  "B": 6,
  "C+": 5,
  "C": 4,
  "D": 3,
  "F": 0,
};

const gradeOptions = Object.keys(gradePoints).sort((a, b) => gradePoints[b] - gradePoints[a]);

export const CGPACalculator = () => {
  const [semesters, setSemesters] = useState<Semester[]>([
    {
      id: "1",
      name: "Semester 1",
      subjects: [
        { id: "1", name: "", grade: "A", credits: "" }
      ]
    }
  ]);
  const [cgpa, setCGPA] = useState<number | null>(null);

  const addSemester = () => {
    const newSemester: Semester = {
      id: Date.now().toString(),
      name: `Semester ${semesters.length + 1}`,
      subjects: [{ id: Date.now().toString(), name: "", grade: "A", credits: "" }]
    };
    setSemesters([...semesters, newSemester]);
  };

  const addSubject = (semesterId: string) => {
    setSemesters(semesters.map(sem => {
      if (sem.id === semesterId) {
        return {
          ...sem,
          subjects: [...sem.subjects, {
            id: Date.now().toString(),
            name: "",
            grade: "A",
            credits: ""
          }]
        };
      }
      return sem;
    }));
  };

  const removeSubject = (semesterId: string, subjectId: string) => {
    setSemesters(semesters.map(sem => {
      if (sem.id === semesterId) {
        return {
          ...sem,
          subjects: sem.subjects.filter(subj => subj.id !== subjectId)
        };
      }
      return sem;
    }));
  };

  const removeSemester = (semesterId: string) => {
    setSemesters(semesters.filter(sem => sem.id !== semesterId));
  };

  const updateSubject = (semesterId: string, subjectId: string, field: string, value: string) => {
    setSemesters(semesters.map(sem => {
      if (sem.id === semesterId) {
        return {
          ...sem,
          subjects: sem.subjects.map(subj => {
            if (subj.id === subjectId) {
              return { ...subj, [field]: value };
            }
            return subj;
          })
        };
      }
      return sem;
    }));
  };

  const calculateCGPA = () => {
    let totalWeightedPoints = 0;
    let totalCredits = 0;

    semesters.forEach(semester => {
      semester.subjects.forEach(subject => {
        const credits = parseFloat(subject.credits) || 0;
        const gradePoint = gradePoints[subject.grade] || 0;
        totalWeightedPoints += gradePoint * credits;
        totalCredits += credits;
      });
    });

    if (totalCredits === 0) {
      alert("Please enter subjects with grades and credits");
      return;
    }

    const calculatedCGPA = totalWeightedPoints / totalCredits;
    setCGPA(parseFloat(calculatedCGPA.toFixed(2)));
  };

  const reset = () => {
    setSemesters([
      {
        id: "1",
        name: "Semester 1",
        subjects: [
          { id: "1", name: "", grade: "A", credits: "" }
        ]
      }
    ]);
    setCGPA(null);
  };

  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12 flex justify-center">
      <div className="w-full max-w-6xl">
        <div className="mb-8">
          <Breadcrumbs />
          <h1 className="text-3xl lg:text-4xl font-bold text-heading-navy mb-2 flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <GraduationCap className="w-8 h-8" />
            </div>
            CGPA Calculator
          </h1>
          <p className="text-lg text-on-surface-variant">
            Compute your Cumulative Grade Point Average spanning all academic semesters. Implement exact credit weights and grade inputs to mathematically map your precise degree trajectory.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* University Selector */}
            <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🌍</span>
                <label className="text-base font-semibold text-heading-navy">Select Your University (Optional)</label>
              </div>
              <select className="w-full bg-surface border border-border-slate rounded-lg px-4 py-3 text-heading-navy font-medium focus:outline-none focus:border-primary transition-colors">
                <option>Choose a university...</option>
                <option>University of Delhi</option>
                <option>Indian Institute of Technology</option>
                <option>Mumbai University</option>
              </select>
            </div>

            {/* Semesters */}
            <div className="space-y-4">
              {semesters.map((semester, semesterIndex) => (
                <div key={semester.id} className="bg-surface-container-lowest border border-border-slate rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-heading-navy">{semester.name}</h3>
                    {semesters.length > 1 && (
                      <button
                        onClick={() => removeSemester(semester.id)}
                        className="text-error hover:bg-error/10 p-2 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-on-surface-variant pb-2 border-b border-border-slate">
                      <div className="col-span-6">Subject</div>
                      <div className="col-span-3">Grade</div>
                      <div className="col-span-2">Cr</div>
                      <div className="col-span-1"></div>
                    </div>

                    {semester.subjects.map((subject) => (
                      <div key={subject.id} className="grid grid-cols-12 gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Subject"
                          value={subject.name}
                          onChange={(e) => updateSubject(semester.id, subject.id, "name", e.target.value)}
                          className="col-span-6 bg-surface border border-border-slate rounded-lg px-3 py-2 text-sm text-heading-navy placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors"
                        />
                        <select
                          value={subject.grade}
                          onChange={(e) => updateSubject(semester.id, subject.id, "grade", e.target.value)}
                          className="col-span-3 bg-surface border border-border-slate rounded-lg px-3 py-2 text-sm text-heading-navy focus:outline-none focus:border-primary transition-colors"
                        >
                          {gradeOptions.map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          placeholder="Cr"
                          value={subject.credits}
                          onChange={(e) => updateSubject(semester.id, subject.id, "credits", e.target.value)}
                          className="col-span-2 bg-surface border border-border-slate rounded-lg px-3 py-2 text-sm text-heading-navy placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors"
                        />
                        {semester.subjects.length > 1 && (
                          <button
                            onClick={() => removeSubject(semester.id, subject.id)}
                            className="col-span-1 text-error hover:bg-error/10 p-1.5 rounded transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => addSubject(semester.id)}
                    className="text-primary hover:text-primary-container font-medium text-sm flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Subject
                  </button>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={addSemester}
                className="border border-border-slate text-heading-navy hover:bg-surface-container-low font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Semester
              </button>
              <button
                onClick={calculateCGPA}
                className="bg-success-teal text-heading-navy font-bold px-8 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
              >
                Calculate CGPA
              </button>
              <button
                onClick={reset}
                className="border border-border-slate text-heading-navy hover:bg-surface-container-low font-medium px-6 py-2.5 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Formula */}
            <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📐</span>
                <h3 className="text-lg font-bold text-heading-navy">Formula</h3>
              </div>
              <div className="bg-surface-container-high rounded-lg p-4 text-center">
                <div className="text-sm text-on-surface-variant leading-relaxed">
                  <div className="font-semibold text-heading-navy mb-2">CGPA = Σ (Grade Point × Credits) / Σ Credits</div>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-heading-navy flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-success-teal" />
                How It Works
              </h3>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-success-teal text-heading-navy flex items-center justify-center font-bold flex-shrink-0 text-sm">1</div>
                  <p className="text-sm text-on-surface-variant">Enter Subjects, Grades, and Credit Hours for each semester</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-success-teal text-heading-navy flex items-center justify-center font-bold flex-shrink-0 text-sm">2</div>
                  <p className="text-sm text-on-surface-variant">Grade points are mapped automatically (O=10, A+=9, A=8, etc.)</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-success-teal text-heading-navy flex items-center justify-center font-bold flex-shrink-0 text-sm">3</div>
                  <p className="text-sm text-on-surface-variant">Each grade point is multiplied by its credit weight</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-success-teal text-heading-navy flex items-center justify-center font-bold flex-shrink-0 text-sm">4</div>
                  <p className="text-sm text-on-surface-variant">Sum of weighted points is divided by total credits</p>
                </div>
              </div>
            </div>

            {/* Result */}
            {cgpa !== null && (
              <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-6 text-center">
                <p className="text-sm font-semibold text-on-surface-variant uppercase mb-2">Your CGPA</p>
                <div className="text-4xl font-bold text-success-teal">{cgpa.toFixed(2)}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
