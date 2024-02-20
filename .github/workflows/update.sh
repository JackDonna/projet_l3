#!/bin/bash
ssh debian@57.128.18.224
cd node_projet/projet_l3/exemples/express-project/
sudo docker-compose down
sudo git pull
sudo docker-compose build
sudo docker-compose up -d
