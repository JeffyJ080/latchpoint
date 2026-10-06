# --- Dockerfile for adapter-layer (Java / Spring Boot) ---
# Place this file inside the adapter-layer/ folder once real code exists.
# Same two-stage pattern as auth-core: build with Maven, run on a lighter JRE image.

# --- Stage 1: Build ---
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# --- Stage 2: Run ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]