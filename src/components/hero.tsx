import { Button } from "@/components/ui/button"
import { ArrowRight, Github } from "lucide-react"

export function Hero() {
  return (
    <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-100 via-pink-100 to-amber-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-amber-900/30 rounded-full border-2 border-purple-200 dark:border-purple-700 shadow-sm">
          <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 dark:from-purple-300 dark:via-pink-300 dark:to-amber-300 bg-clip-text text-transparent">Discover what's trending in open source</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight px-2">
          Understand <span className="text-primary">GitHub Repositories</span> Like Never Before
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
          Get instant insights into any open source project. Analyze stars, discover important pull requests, track
          version updates, and uncover fascinating project facts.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-500 hover:via-yellow-500 hover:to-orange-500 text-slate-900 font-bold shadow-lg hover:shadow-xl transition-all duration-300 gap-2 group border-0"
          >
            Get Started Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="gap-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-slate-200 font-medium shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-border px-4 sm:px-0">
          <div>
            <div className="text-xl sm:text-2xl font-bold text-primary">10K+</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Repositories Analyzed</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-primary">99.9%</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Uptime</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-primary">50ms</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Avg Response Time</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-primary">24/7</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Real-time Updates</div>
          </div>
        </div>
      </div>
    </section>
  )
}
