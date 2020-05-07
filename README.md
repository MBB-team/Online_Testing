# Online_testing
Codes for Online Testing Using JavaScript and JsPsych 

# Installation
```bash
docker system prune --all --force # Reset docker
docker-compose up --force-recreate # Start docker images : see docker-compose.yml
```
Wait for mariadb initialization before connecting with a client :   
mariadb-docker_1  | 2020-05-06 11:24:35 0 [Note] mysqld: ready for connections.   

# Command line to php or mariadb
```bash
docker-compose exec php bash
```

# Debug
To debug php, use Vscode with Xdebug.   
To debug js, use Chrome debug tool.   
To debug sql, use Dbeaver.

# Information
https://github.com/MBB-team/Online_Testing   
experiment_RSVP.html : main app entry point.   
write_data.php : get data and write to db.   
create_tableemo.sql : create table.   
jsPsych-master : web framework.   

# AWS
## 1. Config sur console aws
Amazon Linux 2 AMI (HVM), SSD Volume Type -(64-bit x86) / (64-bit Arm)   
t2-medium   
Network = ICONICS_VPC  
Subnet ICONICS_SUB_FRONT   
Auto assign pulic ip (required for internet connection)   
8Go ssd (default)   
Security group : ICONICS_SG_WEB_FRONT   
Key pair : econics-staging : iconics-staging.pem   
Elastic ip : associer l'adresse

## 2. SSH
ssh -i "iconics-staging.pem" ec2-user@172.21.2.249 # replace ip with private ip
### Install and start Docker
sudo yum update -y   
sudo amazon-linux-extras install docker -y   
sudo service docker start   
### Add ec2-user to the Docker group
sudo usermod -a -G docker ec2-user  
sudo systemctl enable docker   
### Install Docker-Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose   
sudo chmod +x /usr/local/bin/docker-compose   
docker-compose --version   
### Set Timezone
sudo rm /etc/localtime   
sudo ln -s /usr/share/zoneinfo/Europe/Paris /etc/localtime
### Install git
sudo yum install -y git

## 3. Clone source code
git clone https://github.com/MBB-team/Online_Testing   
cd Online_Testing/   
git checkout aws

## 4. Run docker-compose
Exit ssh and reconnect.   
cd ~/Online_Testing   
docker-compose up -d

## 5. Open ports on aws
New security group -> Allow http and mariadb port   
Assign security group

## 6. Deploy a new version
cd ~/Online_Testing   
docker-compose down
git checkout aws   
git pull   
docker-compose up -d   

## 7. Connect to the url
firefox http://34.255.60.185/experiment_RSVP.html   
