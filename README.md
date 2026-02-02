# 💜 starboard

> 고객의 사랑을 수집하고 전시하세요

고객 후기를 쉽게 수집하고 웹사이트에 예쁜 위젯으로 전시하는 SaaS 서비스입니다.

## ✨ 기능

- 📮 **후기 수집 폼** - 공유 가능한 링크로 고객 후기 수집
- ⭐ **별점 + 텍스트** - 고객이 쉽게 후기 작성
- ✅ **승인 시스템** - 원하는 후기만 공개
- 🎨 **임베드 위젯** - 한 줄 코드로 웹사이트에 설치
- 💰 **구독 모델** - Free / Pro / Business

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

```bash
cp .env.example .env
# .env 파일을 열어서 값들을 채워주세요
```

### 3. 데이터베이스 설정

```bash
# Prisma 클라이언트 생성 및 DB 동기화
npm run db:push
```

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인하세요!

## 📁 프로젝트 구조

```
starboard/
├── prisma/
│   └── schema.prisma      # DB 스키마
├── public/
│   └── widget.js          # 임베드 위젯 스크립트
├── src/
│   ├── app/
│   │   ├── page.tsx       # 랜딩 페이지
│   │   ├── dashboard/     # 대시보드
│   │   ├── collect/       # 후기 수집 페이지
│   │   └── api/           # API 라우트
│   ├── components/        # 재사용 컴포넌트
│   └── lib/
│       ├── db.ts          # Prisma 클라이언트
│       ├── auth.ts        # NextAuth 설정
│       └── utils.ts       # 유틸리티 함수
└── PLAN.md                # 기획서
```

## 🛠️ 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Prisma
- **Auth**: NextAuth.js
- **Payment**: Stripe
- **Hosting**: Vercel

## 📦 위젯 사용법

웹사이트에 아래 코드를 추가하세요:

```html
<div id="starboard-widget" data-slug="your-project-slug"></div>
<script src="https://starboard.app/widget.js"></script>
```

## 🔧 개발 명령어

```bash
npm run dev       # 개발 서버
npm run build     # 프로덕션 빌드
npm run start     # 프로덕션 서버
npm run lint      # 린트 검사
npm run db:push   # DB 스키마 동기화
npm run db:studio # Prisma Studio 실행
```

## 📝 환경변수

| 변수 | 설명 | 필수 |
|-----|------|-----|
| `DATABASE_URL` | PostgreSQL 연결 문자열 | ✅ |
| `NEXTAUTH_URL` | 앱 URL | ✅ |
| `NEXTAUTH_SECRET` | 세션 암호화 키 | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth | ❌ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth | ❌ |
| `STRIPE_SECRET_KEY` | Stripe 시크릿 키 | ❌ |

## 🚢 배포

### Vercel (권장)

1. GitHub에 푸시
2. Vercel에서 Import
3. 환경변수 설정
4. 배포!

### 데이터베이스 옵션

- [Supabase](https://supabase.com) - 무료 티어 제공
- [Neon](https://neon.tech) - 무료 티어 제공
- [PlanetScale](https://planetscale.com) - MySQL 기반

## 💰 수익 모델

| 플랜 | 가격 | 프로젝트 | 후기 |
|-----|------|---------|------|
| Free | $0/월 | 1개 | 10개 |
| Pro | $9/월 | 3개 | 무제한 |
| Business | $29/월 | 무제한 | 무제한 |

## 📄 라이선스

MIT License

---

Made with 💜 for indie makers
