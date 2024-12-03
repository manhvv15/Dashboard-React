def tagImage
def folder

pipeline {
    agent none     
    parameters {
        choice choices: ['NO', 'YES' ], description: 'Deploy QC v1?', name: 'DEPLOY_QC_V1'
        choice choices: ['NO', 'YES'], description: 'Deploy QC v2?', name: 'DEPLOY_QC_V2'
            
        choice choices: ['NO', 'YES'], description: 'Build Image Staging v1?', name: 'BUILD_IMAGE_STAGING_V1'
        choice choices: ['NO', 'YES'], description: 'Build Image Staging v2?', name: 'BUILD_IMAGE_STAGING_V2'
            
        choice choices: ['NO', 'YES'], description: 'Build Image Production v1?', name: 'BUILD_IMAGE_PRODUCTION_V1'
        choice choices: ['NO', 'YES'], description: 'Build Image Production v2?', name: 'BUILD_IMAGE_PRODUCTION_V2'
        string(defaultValue: "portal", description: 'Namespace K8S', name: 'NAMESPACE_QC')
        string(defaultValue: "dashboard-portal-v1", description: 'Deployment Name', name: 'SERVICE_V1')
        string(defaultValue: "dashboard-portal-v2", description: 'Deployment Name', name: 'SERVICE_V2')

        string(defaultValue: "1.0.0", description: 'Tag Image Staging v1', name: 'TAG_IMAGE_STAGING_V1') 
        string(defaultValue: "2.0.0", description: 'Tag Image Staging v2', name: 'TAG_IMAGE_STAGING_V2')

        string(defaultValue: "1.0.0", description: 'Tag Image Production v1', name: 'TAG_IMAGE_PROD_V1') 
        string(defaultValue: "2.0.0", description: 'Tag Image Production v2', name: 'TAG_IMAGE_PROD_V2')
    }


    stages {

        stage('setup-staging') {
            when {
                anyOf {
                  branch("staging")
                }
            }
            steps {
                script {
                     if (params.BUILD_IMAGE_STAGING_V1 == 'YES' && params.TAG_IMAGE_STAGING_V1 == '1.0.0') {
                        tagImage = "1.0.$BUILD_NUMBER"
                        folder = "./v1"
                     } else if (params.BUILD_IMAGE_STAGING_V1 == 'YES' && params.TAG_IMAGE_STAGING_V1 != '1.0.0') {
                       tagImage = params.TAG_IMAGE_STAGING_V1
                       folder = "./v1"
                     } else{
                       tagImage = "1.0.0"
                       folder = "."
                     }
                }
            }
        }

        stage('setup-product') {
            when {
                anyOf {
                  branch("production")
                }
            }
            steps {
                script {
                     if (params.BUILD_IMAGE_PRODUCTION_V1 == 'YES' && params.TAG_IMAGE_PROD_V1 == '1.0.0') {
                        tagImage = "1.0.$BUILD_NUMBER"
                        folder = "./v1"
                     } else if (params.BUILD_IMAGE_PRODUCTION_V1 == 'YES' && params.TAG_IMAGE_PROD_V1 != '1.0.0') {
                       tagImage = params.TAG_IMAGE_PROD_V1
                       folder = "./v1"
                     } else{
                       tagImage = "1.0.0"
                       folder = "."
                     }
                }
            }
        }

        stage('deploy-development-v1'){
            agent any
            when {
                allOf {
                  branch("master")
                  expression { params.DEPLOY_QC_V1 == 'YES' }
                }
            }
            steps {
                script{
                    docker.withRegistry( 'http://docker-hub.ichiba.net', 'harbor-cred' ) {
                       def image = docker.build("docker-hub.ichiba.net/ichiba-qc/ichiba.web.dashboard-portal:1.0.0", "-f Dockerfile .")
                       image.push()
                    }
                }
            }
        }

        stage('deploy-development-v2'){
            agent any
            when {
                allOf {
                  branch("master")
                  expression { params.DEPLOY_QC_V2 == 'YES' }
                }
            }
            steps {
                script{
                    docker.withRegistry( 'http://docker-hub.ichiba.net', 'harbor-cred' ) {
                       def image = docker.build("docker-hub.ichiba.net/ichiba-qc/ichiba.web.dashboard-portal:2.0.0", "-f Dockerfile .")
                       image.push()
                    }
                }
            }
        }

        stage('build-helm-qc'){
            agent any
            when {
                allOf {
                  branch("master")
                  expression { params.DEPLOY_QC_V1 == 'YES' }
                }
            }
            steps {
                 sh 'cd helm/dashboard-portal-react/qc/ && chmod +x publish.sh && ./publish.sh harbor-qc 1.0.0 .'
                 build job: 'deploy development/master', wait: true,
                 parameters: [
                     string(name: 'NAMESPACE', value: params.NAMESPACE_QC),
                     string(name: 'SERVICE', value: params.SERVICE_V1)
                 ]
            }
        }

        stage('build-image-staging-v1'){
            agent any
            when {
                allOf {
                  branch("staging")
                  expression { params.BUILD_IMAGE_STAGING_V1 == 'YES' }
                }
            }
            steps {
                timeout(time: 15, unit: "MINUTES") {
                    input message: 'Do you want to approve the deployment?', ok: 'Yes'
                }		
                echo "Initiating deployment"
                script{
                    docker.withRegistry( 'http://docker-hub.ichiba.net', 'harbor-cred' ) {
                       def image = docker.build("docker-hub.ichiba.net/ichiba-staging/ichiba.web.dashboard-portal:${tagImage}", "-f Dockerfile .")
                       image.push()
                    }
                }     
            }
        }

        stage('build-image-staging-v2'){
            agent any
            when {
                allOf {
                  branch("staging")
                  expression { params.BUILD_IMAGE_STAGING_V2 == 'YES' }
                }
            }
            steps {
                timeout(time: 15, unit: "MINUTES") {
                    input message: 'Do you want to approve the deployment?', ok: 'Yes'
                }		
                echo "Initiating deployment"
                script{
                    docker.withRegistry( 'http://docker-hub.ichiba.net', 'harbor-cred' ) {
                       def image = docker.build("docker-hub.ichiba.net/ichiba-staging/ichiba.web.dashboard-portal:${tagImage}", "-f Dockerfile .")
                       image.push()
                    }
                }     
            }
        }
        
        stage('build-helm-staging'){
            agent any
            when {
                allOf {
                  branch("staging")
                  expression { params.BUILD_IMAGE_STAGING_V1 == 'YES' }
                }
            }
            steps {
                sh "cd helm/dashboard-portal-react/staging/ && chmod +x publish.sh && ./publish.sh harbor ${tagImage} ${folder}"
            }
        }                

        stage('build-image-product-v1'){
            agent any
            when {
                allOf {
                  branch("production")
                  expression { params.BUILD_IMAGE_PRODUCTION_V1 == 'YES' }
                } 
            }
            steps {
                timeout(time: 15, unit: "MINUTES") {
                    input message: 'Do you want to approve the deployment?', ok: 'Yes'
                }		
                echo "Initiating deployment"
                script{
                    docker.withRegistry( 'http://docker-hub.ichiba.net', 'harbor-cred' ) {
                       def image = docker.build("docker-hub.ichiba.net/ichiba-product/ichiba.web.dashboard-portal:${tagImage}", "-f Dockerfile .")
                       image.push()
                    }
                }
            }
        } 

        stage('build-image-product-v2'){
            agent any
            when {
                allOf {
                  branch("production")
                  expression { params.BUILD_IMAGE_PRODUCTION_V2 == 'YES' }
                } 
            }
            steps {
                timeout(time: 15, unit: "MINUTES") {
                    input message: 'Do you want to approve the deployment?', ok: 'Yes'
                }		
                echo "Initiating deployment"
                script{
                    docker.withRegistry( 'http://docker-hub.ichiba.net', 'harbor-cred' ) {
                       def image = docker.build("docker-hub.ichiba.net/ichiba-product/ichiba.web.dashboard-portal:${tagImage}", "-f Dockerfile .")
                       image.push()
                    }
                }
            }
        }
        
        stage('build-helm-prod'){
            agent any
            when {
                allOf {
                  branch("production")
                  expression { params.BUILD_IMAGE_PRODUCTION_V1 == 'YES' }
                }
            }
            steps {
                 sh "cd helm/dashboard-portal-react/prod/ && chmod +x publish.sh && ./publish.sh harbor-prod ${tagImage} ${folder}"
            }
        }         
        
    }
}