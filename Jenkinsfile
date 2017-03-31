pipeline {
    agent any

    stages {
        stage('Deploy') {
            steps {
                sh 'ssh root@aggautomation.com "stop sd-web"'
                sh 'ssh root@aggautomation.com "rm -rf /apps/sd-web && mkdir /apps/sd-web"'
                sh 'scp -r . root@aggautomation.com:/apps/sd-web'
                sh 'ssh root@aggautomation.com "cd /apps/sd-web && chmod +x start.sh"'
                sh 'ssh root@aggautomation.com "start sd-web"'
            }
        }
    }
}