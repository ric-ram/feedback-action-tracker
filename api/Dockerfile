FROM amazoncorretto:21.0.10-alpine AS dev
WORKDIR /app

COPY .mvn .mvn
COPY mvnw pom.xml ./

RUN ./mvnw -q dependency:go-offline

CMD ["./mvnw", "spring-boot:run"]