#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Start the Spring Boot application with Maven wrapper
# The profile is already set to 'local' in application.yml
./mvnw spring-boot:run