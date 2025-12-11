import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, GitPullRequest, Package, Zap, BarChart3, Lightbulb } from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Repository Summary",
    description: "Get a comprehensive overview of any repository including description, language, and key metrics.",
  },
  {
    icon: Star,
    title: "Star Analytics",
    description: "Track star growth trends, daily increases, and understand what drives repository popularity.",
  },
  {
    icon: Lightbulb,
    title: "Cool Facts",
    description:
      "Discover interesting insights about projects like contributor count, top languages, and activity patterns.",
  },
  {
    icon: GitPullRequest,
    title: "Latest Pull Requests",
    description: "Stay updated with the most important PRs, including recent merges and open contributions.",
  },
  {
    icon: Package,
    title: "Version Updates",
    description: "Track release history, version tags, and changelog information at a glance.",
  },
  {
    icon: Zap,
    title: "Real-time Monitoring",
    description: "Get instant notifications and live updates about repository changes and milestones.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">Powerful Features</h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-4">Everything you need to understand open source repositories</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="bg-card border-border hover:border-primary/50 transition-colors group">
                <CardHeader>
                  <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
