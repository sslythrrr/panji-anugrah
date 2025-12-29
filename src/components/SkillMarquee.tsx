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
import { useRef, useState } from "react";

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
  const duplicatedSkills = [...skills, ...skills, ...skills, ...skills];
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsPaused(true);
    startX.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft.current = scrollRef.current?.scrollLeft || 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 2;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setIsPaused(false);
    }
  };

  return (
    <div
      ref={scrollRef}
      className="w-full overflow-x-auto overflow-y-hidden py-6 mask-gradient scrollbar-hide cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`flex gap-10 ${!isPaused ? 'animate-marquee' : ''}`}
        style={{
          width: "max-content",
          animationPlayState: isPaused ? 'paused' : 'running',
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
