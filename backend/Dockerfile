# ── 1단계: 빌드 ──────────────────────────────────────────
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app

# Gradle Wrapper + 의존성 캐시 레이어 (소스 변경 없으면 재사용)
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
RUN chmod +x ./gradlew && ./gradlew dependencies --no-daemon -q

# 소스 빌드 (테스트 제외 — DB 없는 CI 환경 대응)
COPY src src
RUN ./gradlew clean build -x test --no-daemon

# ── 2단계: 실행 ──────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
