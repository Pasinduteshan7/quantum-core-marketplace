pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'quantumcore'
        BUILD_TAG = "${env.BUILD_NUMBER}"
        HOST_DOMAIN = 'localhost'
    }

    stages {
        // ─── STAGE 1: Download code from GitHub ──────────────────────────────
        stage('Checkout') {
            steps {
                echo '📥 Pulling latest code from GitHub...'
                checkout scm
            }
        }

        // ─── STAGE 2: Parallel Builds (Spring Boot & Next.js together) ───────
        stage('Build & Package') {
            parallel {
                stage('Build Spring Boot Backend') {
                    environment {
                        JAVA_HOME = '/usr/lib/jvm/java-21-openjdk-amd64'
                        PATH = "/usr/lib/jvm/java-21-openjdk-amd64/bin:${env.PATH}"
                    }
                    steps {
                        echo "☕ [Java 21] Packaging backend JAR & Docker image..."
                        dir('backend-springboot') {
                            sh 'chmod +x mvnw && ./mvnw clean package -DskipTests'
                            sh "docker build -t quantumcore-backend:${BUILD_TAG} -t quantumcore-backend:latest ."
                        }
                    }
                }

                stage('Build Next.js Frontend') {
                    steps {
                        echo "🌐 [Next.js 15] Building standalone frontend Docker image..."
                        dir('frontend') {
                            sh "docker build -t quantumcore-frontend:${BUILD_TAG} -t quantumcore-frontend:latest ."
                        }
                    }
                }
            }
        }

        // ─── STAGE 3: Deploy Stack on Server ────────────────────────────────
        stage('Deploy Stack') {
            steps {
                echo '🚀 Refreshing containers in background...'
                sh 'docker rm -f quantumcore_postgres quantumcore_springboot quantumcore_frontend || true'
                sh 'docker compose up -d --remove-orphans'
            }
        }

        // ─── STAGE 4: Smart Health Checks with Auto-Retry Loops ─────────────
        stage('Health Check & Verification') {
            steps {
                echo '🔍 Performing smart health checks...'
                sh '''
                    # 1. Check PostgreSQL readiness
                    echo "Checking PostgreSQL..."
                    for i in {1..10}; do
                        if docker compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
                            echo "✅ PostgreSQL is healthy!"
                            break
                        fi
                        echo "Waiting for PostgreSQL ($i/10)..."
                        sleep 2
                    done

                    # 2. Check Spring Boot API with 12 retries (up to 60s)
                    echo "Checking Spring Boot Backend API..."
                    backend_ok=false
                    for i in {1..12}; do
                        if docker exec quantumcore_springboot wget -qO- http://localhost:8080/api/products?category=Smartphones > /dev/null 2>&1; then
                            echo "✅ Backend API is healthy & products seeded!"
                            backend_ok=true
                            break
                        fi
                        echo "Waiting for Spring Boot ($i/12)..."
                        sleep 5
                    done

                    if [ "$backend_ok" = false ]; then
                        echo "❌ Backend health check failed! Container logs:"
                        docker compose logs --tail=30 backend
                        exit 1
                    fi

                    # 3. Check Next.js Frontend Storefront
                    echo "Checking Next.js Frontend..."
                    curl -f http://localhost:3000 > /dev/null 2>&1 || {
                        echo "❌ Frontend check failed! Container logs:"
                        docker compose logs --tail=25 frontend
                        exit 1
                    }
                    echo "✅ Frontend is healthy!"
                '''
            }
        }
    }

    // ─── POST ACTIONS: Clean Cache & Print Rich Deployment Summary ──────────
    post {
        always {
            echo '🧹 Cleaning up dangling build images...'
            sh 'docker image prune -f || true'
        }
        success {
            echo """
            =================================================================
               🎉 QUANTUM CORE DEPLOYMENT SUCCESSFUL! (Build #${BUILD_TAG})
            =================================================================
             Storefront UI:   http://${HOST_DOMAIN}:3000
             REST API:        http://${HOST_DOMAIN}:8080/api/products
             Database:        PostgreSQL on port 5433
             Build Number:    #${BUILD_TAG}
            =================================================================
            """
        }
        failure {
            echo """
            =================================================================
               ❌ DEPLOYMENT FAILED FOR BUILD #${BUILD_TAG}!
            =================================================================
             Check the logs above.
             Troubleshooting commands:
              - docker compose logs --tail=50
              - docker compose ps
            =================================================================
            """
        }
    }
}