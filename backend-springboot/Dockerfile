# ════════════════════════════════════════════════════════════════════
# ⚡ Production Runtime for Spring Boot (Java 21 JRE Alpine)
# ════════════════════════════════════════════════════════════════════
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create unprivileged application user
RUN addgroup -S spring && adduser -S spring -G spring

# Copy pre-compiled fat JAR
COPY target/*.jar app.jar

RUN chown spring:spring app.jar

USER spring

EXPOSE 8080

# Container-aware JVM memory optimization flags
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
