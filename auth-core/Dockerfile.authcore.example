# --- Dockerfile for auth-core (Java / Spring Boot) ---
# Place this file inside the auth-core/ folder once real code exists.
# Uses a two-stage build: build the app with Maven, then run it on a lighter Java image.
# This keeps the final image small (no Maven/build tools bloating it).

# --- Stage 1: Build ---
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
# Downloads dependencies first — Docker caches this layer, so rebuilds are faster
# as long as pom.xml hasn't changed.
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# --- Stage 2: Run ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copy only the built .jar from the previous stage — nothing else comes along.
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]