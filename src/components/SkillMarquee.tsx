import { 
  SiKotlin,
  SiFlutter,
  SiDart,
  SiAndroid,
  SiPython,
  SiPandas,
  SiNumpy,
  SiSelenium,
  SiNodedotjs,
  SiExpress,
  SiMysql,
  SiFlask,
  SiTensorflow,
  SiAndroidstudio,
} from "react-icons/si";
import { 
  LineChart, 
  Workflow, 
  TestTube2, 
  Code2, 
  BarChart3, 
  PieChart,
  Settings
} from "lucide-react";

const skills = [
  { name: "Kotlin", icon: SiKotlin },
  { name: "Flutter", icon: SiFlutter },
  { name: "Dart", icon: SiDart },
  { name: "Android", icon: SiAndroid },
  { name: "Python", icon: SiPython },
  { name: "Pandas", icon: SiPandas },
  { name: "NumPy", icon: SiNumpy },
  { name: "Matplotlib", icon: LineChart },
  { name: "Playwright", icon: TestTube2 },
  { name: "Selenium", icon: SiSelenium },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "Express.js", icon: SiExpress },
  { name: "MySQL", icon: SiMysql },
  { name: "Flask", icon: SiFlask },
  { name: "TensorFlow Lite", icon: SiTensorflow },
  { name: "Android Studio", icon: SiAndroidstudio },
  { name: "VSCode", icon: Code2 },
  { name: "PowerBI", icon: BarChart3 },
  { name: "Looker", icon: PieChart },
  { name: "iThink", icon: Workflow },
  { name: "SPSS", icon: Settings },
];

const SkillMarquee = () => {
  // Quadruple for seamless infinite loop
  const duplicatedSkills = [...skills, ...skills, ...skills, ...skills];

  return (
    <div className="w-full overflow-hidden py-6 mask-gradient">
      <div 
        className="flex gap-10 animate-marquee"
        style={{
          width: "max-content",
        }}
      >
        {duplicatedSkills.map((skill, index) => {
          const Icon = skill.icon;
          return (
            <div
              key={`${skill.name}-${index}`}
              className="flex items-center gap-2.5 text-foreground/40 hover:text-foreground/80 transition-colors duration-300 group cursor-default"
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium whitespace-nowrap">
                {skill.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillMarquee;
