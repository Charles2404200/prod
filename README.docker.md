MAKE SURE YOUR DOCKER DESKTOP OR WHAT EVER IS ON

turns on docker and let it run in background so you can still use terminal:
docker compose up --build -d

turns off docker:
docker compose down

deletes cached build:
docker builder prune -a

remove docker stack:
docker stack rm mystack

deploy docker swarm:
docker stack deploy -c docker-stack.yml mystack
docker stack services mystack
docker service logs mystack_backend

build images and push:
docker build -f ci/Dockerfile.backend -t ghcr.io/apotato4325/rmit-store-backend:latest .
docker push ghcr.io/apotato4325/rmit-store-backend:latest

docker build -f ci/Dockerfile.frontend -t ghcr.io/apotato4325/rmit-store-frontend:latest .
docker push ghcr.io/apotato4325/rmit-store-frontend:latest

check docker images:
docker images | egrep 'rmit-store-(frontend|backend)'