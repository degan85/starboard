# starboard - 기획서

> "고객의 사랑을 수집하고 전시하세요"

---

## 📋 프로젝트 개요

| 항목 | 내용 |
|-----|------|
| **프로젝트명** | starboard (러브월) |
| **한 줄 설명** | 고객 후기를 쉽게 수집하고 웹사이트에 예쁘게 전시하는 위젯 서비스 |
| **타겟 시장** | 한국 + 글로벌 |
| **개발 기간** | 2주 (MVP) |
| **기술 스택** | Next.js 14, TypeScript, Tailwind CSS, Prisma, PostgreSQL |

---

## 🔥 문제 정의

### 현재 상황
1. **후기 수집이 어렵다**
   - 고객에게 리뷰 요청하는 게 번거로움
   - 이메일, 카톡, DM으로 따로 받으면 관리가 안됨
   - 텍스트/영상 후기가 여기저기 흩어져 있음

2. **후기 전시가 어렵다**
   - 웹사이트에 예쁘게 보여주려면 개발이 필요
   - 네이버 리뷰, 인스타 댓글 등을 가져오기 힘듦
   - 직접 코딩하거나 디자이너 고용해야 함

3. **신뢰 구축이 어렵다**
   - 방문자는 "진짜 후기인가?" 의심
   - 사회적 증거(Social Proof) 부족 → 전환율 하락

### 고통받는 사람들
- 🛍️ 스마트스토어 / 쇼핑몰 운영자
- 💼 프리랜서 / 1인 기업
- 📚 온라인 강의 제작자
- 🏢 SaaS / B2B 스타트업
- 🎨 디자이너, 개발자 포트폴리오

---

## 💡 해결책: starboard

### 핵심 가치 제안
> "3분 만에 후기 수집 페이지 생성, 1줄 코드로 웹사이트에 임베드"

### 작동 방식
```
1. 회원가입 → 프로젝트 생성
2. 후기 수집 링크 생성 (공유용)
3. 고객이 링크에서 텍스트/영상 후기 작성
4. 대시보드에서 후기 승인/관리
5. 위젯 코드 복사 → 내 웹사이트에 붙여넣기
6. 예쁜 "Wall of Love" 자동 표시!
```

---

## 👥 타겟 사용자

### 1차 타겟: 한국 소상공인 & 1인 기업
- 스마트스토어 판매자
- 클래스101/탈잉 강사
- 프리랜서 (디자이너, 개발자, 마케터)
- 인스타그램 쇼핑몰

### 2차 타겟: 글로벌 SaaS & 크리에이터
- 인디 해커 / 부트스트래퍼
- Gumroad / 노션 템플릿 판매자
- 유튜버, 팟캐스터

### 사용자 페르소나
```
이름: 김지영 (32세)
직업: 프리랜서 브랜드 디자이너
고민: 포트폴리오 사이트에 클라이언트 후기를 넣고 싶은데,
      매번 캡처해서 이미지로 올리기 번거로움.
      전문적으로 보이는 후기 섹션이 필요함.
```

---

## 🛠️ 핵심 기능 (MVP)

### Must Have (2주 내 구현)
| 기능 | 설명 | 우선순위 |
|-----|------|---------|
| **후기 수집 폼** | 공유 가능한 링크, 텍스트+별점+이름+사진 | P0 |
| **대시보드** | 후기 목록, 승인/거부, 삭제 | P0 |
| **임베드 위젯** | 복사 가능한 스크립트 코드 | P0 |
| **위젯 디자인** | 그리드/캐러셀 2가지 레이아웃 | P0 |
| **결제 연동** | Stripe (글로벌) | P0 |

### Nice to Have (추후)
| 기능 | 설명 |
|-----|------|
| 영상 후기 | 비디오 업로드 및 재생 |
| AI 요약 | 후기 자동 요약 |
| 다국어 | 한/영/일 지원 |
| 소셜 임포트 | 트위터, 인스타 후기 가져오기 |
| 토스페이먼츠 | 한국 결제 |

---

## 💰 수익 모델

### 가격 정책
| 플랜 | 가격 | 기능 |
|-----|------|------|
| **Free** | $0/월 | 프로젝트 1개, 후기 10개, starboard 브랜딩 |
| **Pro** | $9/월 | 프로젝트 3개, 후기 무제한, 브랜딩 제거 |
| **Business** | $29/월 | 프로젝트 무제한, 영상 후기, 커스텀 도메인 |

### 수익 예상
```
목표: 6개월 내 $1,000 MRR

시나리오:
- Free 사용자: 500명 (마케팅용)
- Pro 전환: 50명 × $9 = $450/월
- Business 전환: 20명 × $29 = $580/월
= $1,030 MRR ✅
```

### Built-in 리텐션
- 해지하면 위젯이 "Powered by starboard" 무료 버전으로 전환
- 이미 웹사이트에 설치된 위젯 → 해지 심리적 장벽

---

## 📅 2주 개발 로드맵

### Week 1: 핵심 기능
| 일차 | 작업 | 산출물 |
|-----|------|--------|
| Day 1-2 | 프로젝트 세팅, DB 스키마, 인증 | 기본 앱 구조 |
| Day 3-4 | 후기 수집 폼 (공개 페이지) | `/collect/[projectId]` |
| Day 5 | 대시보드 UI (후기 목록) | `/dashboard` |
| Day 6-7 | 위젯 생성 & 임베드 스크립트 | `<script>` 코드 |

### Week 2: 결제 & 런칭
| 일차 | 작업 | 산출물 |
|-----|------|--------|
| Day 8-9 | Stripe 결제 연동 | 구독 플랜 |
| Day 10-11 | 랜딩 페이지 | 마케팅 페이지 |
| Day 12 | 버그 수정, 테스트 | QA 완료 |
| Day 13 | Product Hunt 준비 | 런칭 에셋 |
| Day 14 | 🚀 런칭! | 배포 |

---

## 🏗️ 기술 아키텍처

### 스택
```
Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS
Backend: Next.js API Routes, Prisma ORM
Database: PostgreSQL (Supabase 또는 Neon)
Auth: NextAuth.js (Google, Email)
Payment: Stripe
Hosting: Vercel
Widget: Vanilla JS (iframe-free)
```

### 데이터 모델
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  plan      Plan     @default(FREE)
  projects  Project[]
}

model Project {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  testimonials Testimonial[]
}

model Testimonial {
  id         String   @id @default(cuid())
  projectId  String
  project    Project  @relation(fields: [projectId], references: [id])
  name       String
  email      String?
  content    String
  rating     Int      @default(5)
  avatarUrl  String?
  approved   Boolean  @default(false)
  createdAt  DateTime @default(now())
}

enum Plan {
  FREE
  PRO
  BUSINESS
}
```

---

## 🎯 마케팅 전략

### 런칭 채널
1. **Product Hunt** - 첫 주
2. **Twitter/X** - Building in Public
3. **Reddit** - r/SaaS, r/indiehackers
4. **한국 커뮤니티** - 디스콰이엇, 오픈채팅

### 초기 사용자 확보
- [ ] 본인 프로젝트에 먼저 적용 (dogfooding)
- [ ] 지인 5명에게 무료 제공 & 피드백
- [ ] Twitter에서 인디해커 10명에게 무료 제공

### SEO 키워드
- "testimonial widget"
- "wall of love"
- "고객 후기 위젯"
- "리뷰 수집 도구"

---

## ✅ 성공 지표

### 2주 후 (런칭)
- [ ] MVP 완성 & 배포
- [ ] 랜딩 페이지 라이브
- [ ] 첫 10명 회원가입

### 1개월 후
- [ ] 100명 회원가입
- [ ] 10명 유료 전환
- [ ] $90+ MRR

### 3개월 후
- [ ] 500명 회원가입
- [ ] 50명 유료 전환
- [ ] $500+ MRR

---

## 🚀 왜 이게 될 거라고 생각하는가?

### 1. 검증된 시장
- Testimonial.to: 수천 명 유료 사용자
- Senja.io: 빠른 성장 중
- 수요는 입증됨 → 파이를 나눠 먹을 수 있음

### 2. 진입 장벽 낮음
- 2주면 경쟁력 있는 MVP 가능
- 기술적으로 복잡하지 않음

### 3. 반복 수익 구조
- 한 번 설치하면 계속 사용
- 해지 시 위젯 다운그레이드 → 리텐션 장치

### 4. 한국 시장 기회
- 한국어 특화 경쟁자 거의 없음
- 스마트스토어 판매자 수십만 명

### 5. 확장 가능성
- 영상 후기 → 업셀
- AI 기능 → 차별화
- API → B2B

---

## 📁 폴더 구조

```
starboard/
├── PLAN.md              # 이 문서
├── README.md            # 프로젝트 설명
├── package.json
├── prisma/
│   └── schema.prisma    # DB 스키마
├── src/
│   ├── app/
│   │   ├── page.tsx            # 랜딩
│   │   ├── dashboard/          # 대시보드
│   │   ├── collect/[slug]/     # 후기 수집 페이지
│   │   └── api/                # API 라우트
│   ├── components/
│   │   ├── Widget.tsx          # 위젯 컴포넌트
│   │   └── TestimonialCard.tsx
│   └── lib/
│       ├── db.ts               # Prisma client
│       └── stripe.ts           # Stripe 설정
├── public/
│   └── widget.js               # 임베드용 스크립트
└── .env.example
```

---

*다음: MVP 코드 작성 시작! 🚀*
