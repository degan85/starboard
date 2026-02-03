import Link from "next/link";
import { Heart, Star, Zap, Code, ArrowRight, Check } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-brand-600">
            <Heart className="w-6 h-6 fill-brand-500" />
            starboard
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Sign In
            </Link>
            <Link
              href="/login"
              className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Setup in 3 minutes
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Collect & Display
            <br />
            <span className="text-brand-600">Customer Love</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Easily collect testimonials from your customers and showcase them 
            beautifully on your website. The easiest way to boost conversions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-brand-700 transition shadow-lg shadow-brand-500/25"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#demo"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition border border-gray-200"
            >
              See Demo
            </Link>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • Free plan forever
          </p>
        </div>
      </section>

      {/* Demo Widget Section */}
      <section id="demo" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            See it in action ✨
          </h2>
          <p className="text-gray-600 text-center mb-12">
            Real widget preview
          </p>
          
          {/* Sample Widget */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: "Sarah Johnson",
                role: "Freelance Designer",
                content: "So simple! I just send the link to clients and testimonials roll in. My portfolio looks so much more trustworthy now.",
                rating: 5,
              },
              {
                name: "Mike Chen",
                role: "E-commerce Owner",
                content: "Sales increased by 20%. Visitors see real customer reviews and make purchase decisions instantly.",
                rating: 5,
              },
              {
                name: "Emma Williams",
                role: "Course Creator",
                content: "Collecting student testimonials is so easy. One line of code and it's on my landing page!",
                rating: 5,
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-200 flex items-center justify-center text-brand-700 font-semibold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Dead simple setup
          </h2>
          <p className="text-gray-600 text-center mb-12">
            3 steps and you're done!
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Project",
                description: "Sign up and enter your project name.",
              },
              {
                step: "2",
                title: "Share Link",
                description: "Send the collection link to your customers.",
              },
              {
                step: "3",
                title: "Embed Widget",
                description: "Copy one line of code to your website.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why starboard?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Zap,
                title: "Super Easy Setup",
                description: "No coding required. Get started in 3 minutes.",
              },
              {
                icon: Heart,
                title: "Beautiful Design",
                description: "Clean widgets that look great on any website.",
              },
              {
                icon: Star,
                title: "Text + Star Ratings",
                description: "Make it easy for customers to leave reviews.",
              },
              {
                icon: Code,
                title: "Works Everywhere",
                description: "HTML, Notion, WordPress, Shopify, and more!",
              },
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-xl border border-gray-100 hover:border-brand-200 transition">
                <div className="w-12 h-12 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Simple Pricing
          </h2>
          <p className="text-gray-600 text-center mb-12">
            Start free, upgrade when you need more.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Free",
                price: "$0",
                description: "Perfect to start",
                features: [
                  "1 project",
                  "10 testimonials",
                  "Basic widget",
                  "starboard branding",
                ],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Pro",
                price: "$9",
                description: "For growing businesses",
                features: [
                  "3 projects",
                  "Unlimited testimonials",
                  "Custom colors",
                  "Remove branding",
                ],
                cta: "Start Pro",
                popular: true,
              },
              {
                name: "Business",
                price: "$29",
                description: "For serious teams",
                features: [
                  "Unlimited projects",
                  "Video testimonials",
                  "Custom domain",
                  "Priority support",
                ],
                cta: "Start Business",
                popular: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 ${
                  plan.popular
                    ? "bg-brand-600 text-white ring-4 ring-brand-600 ring-offset-2"
                    : "bg-white border border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="text-brand-200 text-sm font-medium mb-2">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className={plan.popular ? "text-brand-200" : "text-gray-500"}>
                  {plan.description}
                </p>
                <div className="my-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={plan.popular ? "text-brand-200" : "text-gray-500"}>
                    /mo
                  </span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <Check className={`w-5 h-5 ${plan.popular ? "text-brand-200" : "text-brand-600"}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={`block text-center py-3 rounded-lg font-semibold transition ${
                    plan.popular
                      ? "bg-white text-brand-600 hover:bg-brand-50"
                      : "bg-brand-600 text-white hover:bg-brand-700"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-brand-600">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Start collecting testimonials today
          </h2>
          <p className="text-brand-100 mb-8">
            Get your first testimonial in under 5 minutes.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-white text-brand-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-brand-50 transition"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white">
            <Heart className="w-5 h-5 fill-brand-500" />
            starboard
          </div>
          <p className="text-sm">
            © 2024 starboard. Made with ❤️ for indie makers.
          </p>
        </div>
      </footer>
    </div>
  );
}
