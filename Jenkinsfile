pipeline {
    agent any

    environment {
        // Defines project name for Docker
        COMPOSE_PROJECT_NAME = 'quantumcore'
    }

    stages {
        // ─── STAGE 1: Download code from GitHub ──────────────────────────────
        stage('Checkout') {
            steps {
                echo '📥 Pulling latest code from GitHub...'
                checkout scm
            }
        }

        // ─── STAGE 2: Build Spring Boot Backend ─────────────────────────────
        stage('Build Backend') {
            steps {
                echo '☕ Packaging Spring Boot 3 (Java 21) JAR...'
                dir('backend-springboot') {
                    // Uses maven wrapper with container flags
                    sh 'chmod +x mvnw && ./mvnw clean package -DskipTests'
                }
            }
        }

        // ─── STAGE 3: Build Docker Containers ────────────────────────────────
        stage('Build Docker Images') {
            steps {
                echo '🐳 Building Docker images for PostgreSQL, Spring Boot & Next.js...'
                sh 'docker compose build'
            }
        }

        // ─── STAGE 4: Deploy on the Server ──────────────────────────────────
        stage('Deploy Stack') {
            steps {
                echo '🚀 Starting all containers in background...'
                sh 'docker compose up -d'
            }
        }

        // ─── STAGE 5: Verify Everything is Alive ────────────────────────────
        stage('Health Check') {
            steps {
                echo '🔍 Verifying containers are healthy...'
                sh '''
                    sleep 15
                    docker compose ps
                    curl -f http://localhost:8080/api/products?category=Smartphones || exit 1
                    curl -f http://localhost:3000 || exit 1
                '''
                echo '✅ Deployment Successful! Storefront is live at http://localhost:3000'
            }
        }
    }

    // ─── POST ACTIONS: Clean up cache ───────────────────────────────────────
    post {
        always {
            echo '🧹 Cleaning up dangling images...'
            sh 'docker image prune -f || true'
        }
        success {
            echo '🎉 All stages completed with GREEN checks!'
        }
        failure {
            echo '❌ Pipeline failed! Check logs above.'
        }
    }
}