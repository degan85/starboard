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
              로그인
            </Link>
            <Link
              href="/login"
              className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            3분 만에 시작하세요
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            고객의 사랑을
            <br />
            <span className="text-brand-600">Wall of Love</span>로
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            고객 후기를 쉽게 수집하고, 웹사이트에 예쁜 위젯으로 전시하세요.
            <br />
            전환율을 높이는 가장 쉬운 방법입니다.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-brand-700 transition shadow-lg shadow-brand-500/25"
            >
              무료로 시작하기
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#demo"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition border border-gray-200"
            >
              데모 보기
            </Link>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            신용카드 필요 없음 • 무료 플랜 영구 제공
          </p>
        </div>
      </section>

      {/* Demo Widget Section */}
      <section id="demo" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            이렇게 보여요 ✨
          </h2>
          <p className="text-gray-600 text-center mb-12">
            실제 위젯 미리보기
          </p>
          
          {/* Sample Widget */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: "김지영",
                role: "프리랜서 디자이너",
                content: "정말 간편해요! 고객들한테 링크만 보내면 후기가 쏙쏙 들어와요. 포트폴리오 사이트가 훨씬 신뢰감 있어 보여요.",
                rating: 5,
              },
              {
                name: "이준혁",
                role: "스마트스토어 운영",
                content: "매출이 20% 올랐어요. 방문자들이 실제 고객 후기 보고 구매 결정을 바로 하더라구요.",
                rating: 5,
              },
              {
                name: "박서연",
                role: "온라인 강사",
                content: "수강생 후기 모으기 진짜 편해요. 코드 한 줄로 노션 페이지에도 바로 넣었어요!",
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
            이렇게 간단해요
          </h2>
          <p className="text-gray-600 text-center mb-12">
            3단계로 끝!
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "프로젝트 생성",
                description: "회원가입하고 프로젝트 이름만 입력하세요.",
              },
              {
                step: "2",
                title: "링크 공유",
                description: "생성된 후기 수집 링크를 고객에게 보내세요.",
              },
              {
                step: "3",
                title: "위젯 설치",
                description: "코드 한 줄 복사해서 웹사이트에 붙여넣으세요.",
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
            왜 starboard인가요?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Zap,
                title: "초간단 설정",
                description: "코딩 몰라도 OK. 3분이면 시작할 수 있어요.",
              },
              {
                icon: Heart,
                title: "예쁜 디자인",
                description: "어떤 웹사이트에도 어울리는 깔끔한 위젯.",
              },
              {
                icon: Star,
                title: "텍스트 + 별점",
                description: "고객이 쉽게 후기를 남길 수 있어요.",
              },
              {
                icon: Code,
                title: "어디서나 사용",
                description: "HTML, 노션, 워드프레스, 쇼피파이 등 어디든!",
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
            심플한 가격
          </h2>
          <p className="text-gray-600 text-center mb-12">
            무료로 시작하고, 필요할 때 업그레이드하세요.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Free",
                price: "$0",
                description: "시작하기 좋은",
                features: [
                  "프로젝트 1개",
                  "후기 10개",
                  "기본 위젯",
                  "starboard 브랜딩",
                ],
                cta: "무료로 시작",
                popular: false,
              },
              {
                name: "Pro",
                price: "$9",
                description: "성장하는 비즈니스",
                features: [
                  "프로젝트 3개",
                  "후기 무제한",
                  "커스텀 색상",
                  "브랜딩 제거",
                ],
                cta: "Pro 시작하기",
                popular: true,
              },
              {
                name: "Business",
                price: "$29",
                description: "모든 것을 원한다면",
                features: [
                  "프로젝트 무제한",
                  "영상 후기",
                  "커스텀 도메인",
                  "우선 지원",
                ],
                cta: "Business 시작",
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
                    가장 인기
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className={plan.popular ? "text-brand-200" : "text-gray-500"}>
                  {plan.description}
                </p>
                <div className="my-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={plan.popular ? "text-brand-200" : "text-gray-500"}>
                    /월
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
            지금 바로 시작하세요
          </h2>
          <p className="text-brand-100 mb-8">
            5분이면 첫 번째 후기를 받을 수 있어요.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-white text-brand-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-brand-50 transition"
          >
            무료로 시작하기
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
