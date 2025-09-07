MAKE SURE YOUR DOCKER DESKTOP OR WHAT EVER IS ON

turns on docker and let it run in background so you can still use terminal:
docker compose up --build -d

turns off docker:
docker compose down

deletes cached build:
docker builder prune -a

deploy docker swarm:
docker stack deploy -c docker-stack.yml mystack
docker stack services mystack
docker service logs mystack_backend

check docker images:
docker images | egrep 'rmit-store-(frontend|backend)'