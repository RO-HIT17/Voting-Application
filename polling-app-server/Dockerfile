#### Stage 1: Build the application
FROM eclipse-temurin:11-jdk-jammy as build

WORKDIR /app

RUN apt-get update && apt-get install -y dos2unix

COPY mvnw .
COPY .mvn .mvn
RUN dos2unix mvnw && chmod +x mvnw

COPY pom.xml .
RUN ./mvnw dependency:go-offline -B

COPY src src
RUN ./mvnw package -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)


#### Stage 2: Run the application
FROM eclipse-temurin:11-jre-jammy

ARG DEPENDENCY=/app/target/dependency

COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

ENTRYPOINT ["java", "-cp", "app:app/lib/*", "com.example.polls.PollsApplication"]
